import { getProxyList } from './list.js';
import { getProxy } from './proxy.js';

// repo with a lot of good proxy sources
// https://github.com/yasirerkam/proxyOPI/blob/main/src/index.ts

export const proxyProvider = {
  /** Get a list of free proxies from the specified source. You can use the Source enum to see all the available sources. */
  getProxyList,
  /** Get a single free proxy, the proxy will be stored to the disk, If the proxy is no more valid it will not be detected, so you have to use: proxyProvider.testProxy to check if it's still valid. */
  getProxy,
};

export { type Proxy, type ProxyList, Source, Protocol, AnonymityLevel } from './types.js';
export type { ProxyListOptions } from './list.js';
export type { ProxyOptions } from './proxy.js';
