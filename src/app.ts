import * as http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import {DefaultHandler, ErrorHandler} from './middlewares';
import {Config, InternalConfig, Controller, Connectable, ErrorMiddleware, Logger, Middleware} from './types';
import {defaultConfig} from './config.default';

export interface ApplicationSettings {
  logger: Logger;
  middlewares?: Array<Middleware>;
  controllers: Array<Controller>;
  defaultHandler?: Middleware;
  errorHandler?: ErrorMiddleware;
  connectableServices?: Array<Connectable>;
  config?: Config;
}

export class Application {
  private readonly _app: express.Application = express();
  private readonly _middlewares?: Array<Middleware>;
  private readonly _controllers: Array<Controller>;
  private readonly _defaultHandler: Middleware;
  private readonly _errorHandler: ErrorMiddleware;
  private readonly _connectableServices?: Array<Connectable>;
  private readonly _logger: Logger;
  private readonly _config: InternalConfig;
  private _server?: http.Server;

  constructor({
    logger,
    controllers,
    middlewares,
    defaultHandler,
    errorHandler,
    connectableServices,
    config
  }: ApplicationSettings) {
    this._config = Object.assign(defaultConfig, config);
    this._logger = logger;
    this._middlewares = middlewares;
    this._controllers = controllers;
    this._defaultHandler = defaultHandler || new DefaultHandler(this._config);
    this._errorHandler = errorHandler || new ErrorHandler(this._config, logger);
    this._connectableServices = connectableServices;
    this._registerShutdownHooks();
    this._registerHandlers();
  }

  async start() {
    this._logger.info('Starting application...');
    await Promise.all(this._connectableServices?.map((service) => service.connect()) || []);
    this._startListening();
  }

  async stop() {
    this._logger.info('Stopping application...');
    if (this._server) {
      this._logger.info('Closing all server connections...');
      await new Promise((resolve) => this._server?.close(() => resolve));
      this._server?.closeAllConnections();
    }
    await Promise.all(this._connectableServices?.map((service) => service.disconnect()) || []);
    this._logger.info('Application successfully stopped');
  }

  private _registerHandlers() {
    this._app.use(
      cors(this._config.cors),
      morgan(this._config.morgan.format, this._config.morgan.options),
      express.json(this._config.bodyParser?.json),
      express.urlencoded(this._config.bodyParser?.urlencoded),
      cookieParser(this._config.cookieParser?.secret, this._config.cookieParser?.options)
    );
    if (this._middlewares?.length) {
      this._app.use(...this._middlewares.map((middleware) => middleware.middleware));
    }
    this._app.use(this._config.baseUrl, ...this._controllers.map((controller) => controller.router));
    this._app.use(this._errorHandler.errorMiddleware);
    this._app.use('*', this._defaultHandler.middleware);
  }

  private _registerShutdownHooks() {
    const gracefulShutdown = async () => {
      await Promise.race([
        this.stop(),
        new Promise((resolve) => setTimeout(resolve, this._config.forcedShutdownTimeoutInSeconds * 1000))
      ]);
      process.exit();
    };
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  }

  private _startListening() {
    const port = this._config.port;
    const cb = () => this._logger.info(`Application started listening on port ${port}`);
    this._server = this._app.listen(port, cb);
  }
}
