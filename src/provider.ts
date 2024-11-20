import coraline from 'coraline';
import { getProxyList } from './list.js';
import { Proxy } from './types.js';
import { testProxy } from './helpers.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import { Protocol, Source } from './enums.js';

// repo with a lot of good proxy sources
// https://github.com/yasirerkam/proxyOPI/blob/main/src/index.ts

export interface ProxyOptions {
  protocol?: Protocol;
  country?: string[];
  testUrl?: string;
  debug?: boolean;
}

export const proxyProvider = async (directory: string, { country, protocol, testUrl, debug }: ProxyOptions = {}) => {
  const cache = coraline.cache(directory);
  const skipFile = path.join(directory, 'skip.json');
  let currentProxy: Proxy | undefined;

  const getSkips = async () => {
    try {
      const buf = await fs.readFile(skipFile);
      return JSON.parse(buf.toString()) as string[];
    } catch {
      return [];
    }
  };

  const skips = await getSkips();

  const addToSkip = async (url: string) => {
    if (!skips.includes(url)) {
      skips.push(url);
      await fs.writeFile(skipFile, JSON.stringify(skips));
    }
  };

  const getNewProxy = async () => {
    for (const [_, provider] of Object.entries(Source)) {
      let proxies = await getProxyList(provider, { protocol });
      if (country) {
        proxies = proxies.filter((pp) => pp.country && country.includes(pp.country));
      }
      proxies = proxies.filter((p) => !skips.includes(p.url));
      if (proxies.length === 0) throw new Error('No more proxies left, please implement a way to reset and retry each one.');
      for (const proxy of proxies) {
        try {
          await testProxy(proxy.url, { testUrl });
          return proxy;
        } catch (err) {
          await addToSkip(proxy.url);
          if (debug) {
            // eslint-disable-next-line no-console
            console.log('Proxy test failed:', err, 'Skiping...');
          }
        }
      }
    }
    throw new Error('No proxy found with this options');
  };

  /** Get a single free proxy, the proxy will be stored to the disk, If the proxy is no more valid it will not be detected, so you have to use: proxyProvider.testProxy to check if it's still valid. */
  const getProxy = () => {
    if (currentProxy) return currentProxy;
    return new Promise<Proxy>((resolve) => {
      const handle = async () => {
        try {
          const data = await cache.use('proxy', getNewProxy, { store: true });
          await testProxy(data.url);
          currentProxy = data;
          resolve(data);
        } catch {
          coraline.log('red', `The stored proxy is no more valid, gettin a new one...`);
          await cache.clear('proxy');
          void handle();
        }
      };
      void handle();
    });
  };

  return {
    /** Get a list of free proxies from the specified source. You can use the Source enum to see all the available sources. */
    getProxyList,
    /** Get a single free proxy, the proxy will be stored to the disk, If the proxy is no more valid it will not be detected, so you have to use: proxyProvider.testProxy to check if it's still valid. */
    getProxy,
    /** Find a new proxy that will replace the current one. */
    getNextProxy: async () => {
      if (!currentProxy) throw new Error('There is no current proxy, please use getProxy before trying to get a next one.');
      await addToSkip(currentProxy.url);
      await cache.clear('proxy');
      return getProxy();
    },
  };
};

export type { Proxy, ProxyList } from './types.js';
export { Source, Protocol, AnonymityLevel } from './enums.js';
