import {ValidationFunction} from '../../types';
import {JSONSchemaType} from 'ajv';

export type JSONSchema<T> = JSONSchemaType<T>;

export interface ValidationService {
  getValidator<T>(schema: JSONSchema<T>): ValidationFunction<T>;
}
