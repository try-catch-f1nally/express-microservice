import express from 'express';
export * from './interfaces/config.interface';
export * from './interfaces/controller.interface';
export * from './interfaces/database.interface';
export * from './interfaces/errorMiddleware.interface';
export * from './interfaces/logger.interface';
export * from './interfaces/middleware.interface';

export type TokenPayload = {
  user: {
    id: string;
  };
};

export interface ValidationFunction<T> {
  (data: any): data is T;
  errors: string[];
}

export type Request = express.Request;
export type Response = express.Response;
export type NextFunction = express.NextFunction;
export const Router = express.Router;
