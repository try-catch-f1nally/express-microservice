import log4js from 'log4js';
import {LoggerService} from './types/logger.service.interface';
import {Config} from '../types';

export class Log4jsService implements LoggerService {
  private _config: Config;

  constructor(config: Config) {
    this._config = config;
    this._init();
  }

  private _init() {
    log4js.configure(
      this._config.log4js || {
        appenders: {all: {type: 'stdout'}},
        categories: {
          default: {appenders: ['all'], level: 'all'}
        }
      }
    );
  }

  getLogger(name: string) {
    return log4js.getLogger(name);
  }
}
