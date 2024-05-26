import express from 'express';
export * from './interfaces/config.interface';
export * from './interfaces/controller.interface';
export * from './interfaces/connectable.interface';
export * from './interfaces/errorMiddleware.interface';
export * from './interfaces/logger.interface';
export * from './interfaces/middleware.interface';
export * from './interfaces/startable.interface';

export type TokenPayload = {
  user: {
    id: string;
  };
};

export interface ValidationFunction<T> {
  (data: any): data is T;
  errors: string[];
}

export type Request = express.Request & Partial<TokenPayload>;
export type Response = express.Response;
export type NextFunction = express.NextFunction;
export type RequestHandler = express.RequestHandler;
export type ErrorRequestHandler = express.ErrorRequestHandler;
export const Router = express.Router;
