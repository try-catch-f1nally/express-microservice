export interface Database {
  connect(): Promise<void>;
  close(): Promise<void>;
}
