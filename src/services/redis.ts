import * as ioredis from 'ioredis';
import {Connectable, Logger, Config} from '../types';
import {getConfigWithDefaults} from '../utils/getConfigWithDefaults';

export interface RedisClient extends ioredis.Redis {}

export class Redis implements Connectable {
  private readonly _client: ioredis.Redis;
  private readonly _logger: Logger;

  constructor(config: Config, logger: Logger) {
    config = getConfigWithDefaults(config);
    if (!config.redis) {
      throw new Error('Redis settings is not configured');
    }
    this._logger = logger;
    this._client = new ioredis.Redis({...config.redis.connectionOptions, lazyConnect: true});
  }

  get client(): RedisClient {
    return this._client;
  }

  async connect() {
    this._logger.info('Connecting to Redis...');
    await this._client.connect();
    this._logger.info('Successfully connected to Redis');
  }

  async disconnect() {
    this._logger.info('Disconnecting from Redis...');
    await this._client.quit();
    this._logger.info('Successfully disconnected from Redis');
  }
}
