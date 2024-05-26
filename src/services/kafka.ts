import kafkajs from 'kafkajs';
import {Connectable, Logger, Config} from '../types';
import {getConfigWithDefaults} from '../utils/getConfigWithDefaults';

export interface KafkaProducer extends kafkajs.Producer {}
export interface KafkaConsumer extends kafkajs.Consumer {}

export class Kafka implements Connectable {
  private readonly _producer: kafkajs.Producer;
  private readonly _consumer: kafkajs.Consumer;
  private readonly _logger: Logger;

  constructor(config: Config, logger: Logger) {
    config = getConfigWithDefaults(config);
    this._logger = logger;
    if (!config.kafka) {
      throw new Error('Kafka settings is not configured');
    }
    const kafkaClient = new kafkajs.Kafka(config.kafka.clientOptions);
    this._producer = kafkaClient.producer(config.kafka.producerOptions);
    this._consumer = kafkaClient.consumer(config.kafka.consumerOptions);
  }

  get producer() {
    return this._producer;
  }

  get consumer() {
    return this._consumer;
  }

  async connect() {
    this._logger.info('Connecting to Kafka consumer...');
    await this._consumer.connect();
    this._logger.info('Successfully connected to Kafka consumer');
    this._logger.info('Connecting to Kafka producer...');
    await this._producer.connect();
    this._logger.info('Successfully connected to Kafka producer');
  }

  async disconnect() {
    this._logger.info('Disconnecting from Kafka consumer...');
    await this._consumer.disconnect();
    this._logger.info('Successfully disconnected from Kafka consumer');
    this._logger.info('Disconnecting from Kafka producer...');
    await this._producer.disconnect();
    this._logger.info('Successfully disconnected from Kafka producer');
  }
}
