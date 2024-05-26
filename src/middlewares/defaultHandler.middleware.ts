import {Request, Response} from 'express';
import {Config, InternalConfig, Middleware} from '../types';
import {getConfigWithDefaults} from '../utils/getConfigWithDefaults';

export class DefaultHandler implements Middleware {
  private readonly _config: InternalConfig;

  constructor(config: Config) {
    this._config = getConfigWithDefaults(config);
  }

  get middleware() {
    return this._defaultHandler.bind(this);
  }

  private _defaultHandler(req: Request, res: Response) {
    res.status(404).json({status: 404, message: this._config.defaultHandler.notFoundErrorHttpMessage});
  }
}
