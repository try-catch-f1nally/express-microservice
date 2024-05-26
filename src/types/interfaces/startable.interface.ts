export interface Startable {
  start(): Promise<void>;
  stop(): Promise<void>;
}
