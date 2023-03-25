import express from 'express';

export interface Controller {
  get router(): express.Router;
}
