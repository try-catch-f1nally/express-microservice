import {Request, Response, NextFunction} from 'express';
import {ApiError, BadRequestError} from '../exceptions';
import {ErrorMiddleware, Config, Logger, InternalConfig} from '../types';
import {defaultConfig} from '../config.default';

export class ErrorHandler implements ErrorMiddleware {
  private _config: InternalConfig;
  private _logger: Logger;

  constructor(config: Config, logger: Logger) {
    this._config = Object.assign(defaultConfig, config);
    this._logger = logger;
  }

  get errorMiddleware() {
    return this._errorMiddleware.bind(this);
  }

  private _errorMiddleware(error: unknown, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ApiError) {
      this._logger.debug(error.message, error);
      const {status, message} = error;
      if (error instanceof BadRequestError) {
        return res.status(status).json({status, message, errors: error.errors});
      }
      return res.status(status).json({status, message});
    }
    if (this._isErrorWithMessage(error)) {
      this._logger.error(error.message, error);
    }
    return res.status(500).json({status: 500, message: this._config.errorHandler.internalErrorHttpMessage});
  }

  private _isErrorWithMessage(error: unknown): error is {message: string} {
    return error instanceof Object && 'message' in error && typeof error.message === 'string';
  }
}
