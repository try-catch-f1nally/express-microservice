import {TokenPayload} from '../index';

declare module 'express-serve-static-core' {
  interface Request extends Request, TokenPayload {}
}
export {};
