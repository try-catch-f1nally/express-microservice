import {InternalConfig} from './types';

export const defaultConfig: InternalConfig = {
  port: 3000,
  baseUrl: '/',
  forcedShutdownTimeoutInSeconds: 10,
  errorHandler: {
    internalErrorHttpMessage: 'Something went wrong, please try again later'
  },
  defaultHandler: {
    notFoundErrorHttpMessage: 'Route not found'
  },
  morgan: {
    format: 'dev'
  },
  bodyParser: {
    urlencoded: {
      extended: false
    }
  }
};
