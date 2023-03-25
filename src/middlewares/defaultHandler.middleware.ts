import {Request, Response} from 'express';
import {Config, InternalConfig, Middleware} from '../types';
import {defaultConfig} from '../config.default';

export class DefaultHandler implements Middleware {
  private _config: InternalConfig;

  constructor(config: Config) {
    this._config = Object.assign(defaultConfig, config);
  }

  get middleware() {
    return this._defaultHandler.bind(this);
  }

  private _defaultHandler(req: Request, res: Response) {
    res.status(404).json({status: 404, message: this._config.defaultHandler.notFoundErrorHttpMessage});
  }
}
