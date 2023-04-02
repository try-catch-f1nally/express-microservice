import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
import {ValidationService, JSONSchema} from './types/validation.service.interface';
import {Config} from '../types';

export class AjvService implements ValidationService {
  private readonly _ajv: Ajv;
  private _config: Config;

  constructor(config: Config) {
    this._config = config;
    this._ajv = new Ajv(Object.assign(this._config.ajv || {}, {allErrors: true}));
    ajvFormats(this._ajv, this._config.ajv?.formatPluginOptions);
    ajvErrors(this._ajv, this._config.ajv?.errorsPluginOptions);
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
