import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
import {JSONSchema, ValidationService} from './types/validation.service.interface';
import {Config} from '../types';
import {getConfigWithDefaults} from '../utils/getConfigWithDefaults';

export class AjvService implements ValidationService {
  private readonly _ajv: Ajv;

  constructor(config: Config) {
    config = getConfigWithDefaults(config);
    this._ajv = new Ajv(Object.assign(config.ajv || {}, {allErrors: true}));
    ajvFormats(this._ajv, config.ajv?.formatPluginOptions);
    ajvErrors(this._ajv, config.ajv?.errorsPluginOptions);
  }

  getValidator<T>(schema: JSONSchema<T>) {
    const validate = this._ajv.compile(schema);

    function validator<T>(data: any): data is T {
      const isValid = validate(data);
      validator.errors = (validate.errors || []).map((err) => err.message || 'Validation error');
      return isValid;
    }

    validator.errors = [] as string[];

    return validator;
  }
}
