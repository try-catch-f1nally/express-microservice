import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import log4js from 'log4js';

export interface InternalConfig {
  port: number;
  dbUri?: string;
  baseUrl: string;
  forcedShutdownTimeoutInSeconds: number;
  auth?: {
    publicKey: string;
  };
  log4js?: log4js.Configuration;
  errorHandler: {
    internalErrorHttpMessage: string;
  };
  defaultHandler: {
    notFoundErrorHttpMessage: string;
  };
  morgan: {
    format: string;
    options?: morgan.Options<any, any>;
  };
  cors?: cors.CorsOptions;
  bodyParser?: {
    json?: bodyParser.OptionsJson;
    urlencoded?: bodyParser.OptionsUrlencoded;
  };
  cookieParser?: {
    secret?: string | string[];
    options?: cookieParser.CookieParseOptions;
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Config extends Partial<InternalConfig> {}
