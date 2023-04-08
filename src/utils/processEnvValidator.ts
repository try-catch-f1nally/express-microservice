import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
import {JSONSchema} from '../services';

const ajv = new Ajv({allErrors: true, coerceTypes: true});
ajvFormats(ajv);
ajvErrors(ajv);

export function processEnvValidator<T>(schema: JSONSchema<T>) {
  if (!ajv.validate(schema, process.env)) {
    const errors = (ajv.errors || []).map((err) => err.message || 'Validation error');
    throw new Error(`Invalid environment variables provided: ${errors.join(', ')}`);
  }
  return process.env;
}
