import {Config, InternalConfig} from '../types';
import {defaultConfig} from '../config.default';

export function isObject(item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null && !Array.isArray(item);
}

export function getConfigWithDefaults(config?: Config): InternalConfig {
  if (!config) {
    return defaultConfig;
  }
  const copy = JSON.parse(JSON.stringify(config));
  deepMerge(copy, defaultConfig);
  return copy;
}

function deepMerge(baseObj: Record<string, any>, srcObj: Record<string, any>) {
  Object.entries(srcObj).forEach(([k, v]) =>
    isObject(baseObj[k]) && isObject(v) ? deepMerge(baseObj[k], v) : (baseObj[k] ??= v)
  );
}
