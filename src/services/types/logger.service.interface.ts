import {Logger} from '../../types';

export interface LoggerService {
  getLogger(name: string): Logger;
}
