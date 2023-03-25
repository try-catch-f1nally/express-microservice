import express from 'express';

export interface ErrorMiddleware {
  get errorMiddleware(): express.ErrorRequestHandler;
}
