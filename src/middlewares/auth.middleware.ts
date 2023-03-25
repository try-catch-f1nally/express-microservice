import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';
import {Middleware, Config, TokenPayload} from '../types';
import {UnauthorizedError} from '../exceptions';

export class AuthMiddleware implements Middleware {
  private _config: Config;

  constructor(config: Config) {
    this._config = config;
    if (!this._config.auth?.publicKey) {
      throw Error('Missing authorization public key in config');
    }
  }

  get middleware() {
    return this._middleware.bind(this);
  }

  private _middleware(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      return next(new UnauthorizedError('Authentication failed due to missing access-token'));
    }
    try {
      const payload = jwt.verify(accessToken, this._config.auth!.publicKey) as TokenPayload;
      req.user = payload.user;
      next();
    } catch (error) {
      next(new UnauthorizedError('Authentication failed due to invalid access-token'));
    }
  }
}
