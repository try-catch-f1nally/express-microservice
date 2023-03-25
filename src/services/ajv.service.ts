import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
import {ValidationService, JSONSchema} from './types/validation.service.interface';

export class AjvService implements ValidationService {
  private readonly _ajv: Ajv;

  constructor() {
    this._ajv = new Ajv({allErrors: true});
    ajvFormats(this._ajv);
    ajvErrors(this._ajv);
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
