import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
import {JSONSchema} from '../services';

const ajv = new Ajv({allErrors: true, coerceTypes: true, useDefaults: true});
ajvFormats(ajv);
ajvErrors(ajv);

export function processEnvValidator<T>(schema: JSONSchema<T>) {
  const defaults = {
    errorMessage: {
      properties: Object.keys(schema.properties as object).reduce(
        (acc, curr) => ((acc[curr] = `invalid ${curr} variable`), acc),
        {} as {[key: string]: string}
      ),
      required: (schema.required as string[]).reduce(
        (acc, curr) => ((acc[curr] = `missing required ${curr} variable`), acc),
        {} as {[key: string]: string}
      )
    }
  };
  schema = Object.assign(defaults, schema);
  if (!ajv.validate(schema, process.env)) {
    const errors = (ajv.errors || []).map((err) => err.message || 'Validation error');
    throw new Error(`Invalid environment variables provided: ${errors.join(', ')}`);
  }
  return process.env;
}
