import mongoose from 'mongoose';
import {Connectable, Logger, Config} from '../types';
import {getConfigWithDefaults} from '../utils/getConfigWithDefaults';

export class MongoDb implements Connectable {
  private readonly _config: Config;
  private readonly _logger: Logger;

  constructor(config: Config, logger: Logger) {
    this._config = getConfigWithDefaults(config);
    if (!this._config.mongodb) {
      throw new Error('MongoDB settings is not configured');
    }
    this._logger = logger;
  }

  async connect() {
    this._logger.info('Connecting to MongoDB...');
    await mongoose.connect(this._config.mongodb!.uri, this._config.mongodb!.connectionOptions);
    this._logger.info('Successfully connected to MongoDB');
  }

  async disconnect() {
    this._logger.info('Disconnecting from MongoDB...');
    await mongoose.connection.close();
    this._logger.info('Successfully disconnected from MongoDB');
  }
}
