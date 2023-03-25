import express from 'express';

export interface Middleware {
  get middleware(): express.RequestHandler;
}
