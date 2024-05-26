import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import log4js from 'log4js';
import mongoose from 'mongoose';
import kafkajs from 'kafkajs';
import * as ioredis from 'ioredis';
import * as ajv from 'ajv';
import * as ajvFormats from 'ajv-formats';
import * as ajvErrors from 'ajv-errors';

export interface InternalConfig {
  port: number;
  baseUrl: string;
  forcedShutdownTimeoutInSeconds: number;
  auth?: {
    publicKey: string;
  };
  errorHandler: {
    internalErrorHttpMessage: string;
  };
  defaultHandler: {
    notFoundErrorHttpMessage: string;
  };
  morgan: {
    format: string;
    options?: morgan.Options<any, any>;
  };
  cors?: cors.CorsOptions;
  bodyParser?: {
    json?: bodyParser.OptionsJson;
    urlencoded?: bodyParser.OptionsUrlencoded;
  };
  cookieParser?: {
    secret?: string | string[];
    options?: cookieParser.CookieParseOptions;
  };
  log4js?: log4js.Configuration;
  ajv?: {
    options?: ajv.Options;
    formatPluginOptions?: ajvFormats.FormatsPluginOptions;
    errorsPluginOptions?: ajvErrors.ErrorMessageOptions;
  };
  mongodb?: {
    uri: string;
    connectionOptions?: mongoose.ConnectOptions;
  };
  redis?: {
    connectionOptions?: ioredis.RedisOptions;
  };
  kafka?: {
    clientOptions: kafkajs.KafkaConfig;
    producerOptions?: kafkajs.ProducerConfig;
    consumerOptions: kafkajs.ConsumerConfig;
  };
}

export interface Config extends Partial<InternalConfig> {}
