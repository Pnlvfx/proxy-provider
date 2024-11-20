/* eslint-disable no-console */
import coraline, { errToString } from 'coraline';
import { getProxyList } from './list.js';
import { Proxy } from './types.js';
import { testProxy } from './helpers.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import { Protocol, Source } from './enums.js';

// repo with a lot of good proxy sources
// https://github.com/yasirerkam/proxyOPI/blob/main/src/index.ts

export interface ProxyOptions {
  protocol?: Protocol | Protocol[];
  country?: string[];
  testUrl?: string;
  debug?: boolean;
}

export const proxyProvider = async (coraPath: string, { country, protocol, testUrl, debug }: ProxyOptions = {}) => {
  const directory = path.join(coraPath, '.proxy');
  await initDir(directory);
  const skipFile = path.join(directory, 'skip.json');
  const proxyFile = path.join(directory, 'proxy.json');
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

  const getStoredProxy = async () => {
    try {
      const buf = await fs.readFile(proxyFile);
      const proxy = JSON.parse(buf.toString()) as Proxy;
      if (debug) {
        console.log('Proxy', proxy.url, 'is your stored proxy.');
      }
      return proxy;
    } catch {
      return;
    }
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const getNewProxy = async () => {
    for (const [_, source] of Object.entries(Source)) {
      let proxies = await getProxyList(source, { protocol });
      if (country) {
        proxies = proxies.filter((pp) => pp.country && country.includes(pp.country));
      }
      proxies = proxies.filter((p) => !skips.includes(p.url));
      if (proxies.length === 0) throw new Error('No more proxies left, please implement a way to reset and retry each one.');
      for (const proxy of proxies) {
        try {
          await testProxy(proxy.url, { testUrl });
          await fs.writeFile(proxyFile, JSON.stringify(proxy));
          if (debug) {
            console.log('Proxy', proxy.url, 'succeed.', 'Stored...');
          }
          return proxy;
        } catch (err) {
          await addToSkip(proxy.url);
          if (debug) {
            console.log('Proxy', proxy.url, 'failed:', errToString(err), 'Skiping...');
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
          currentProxy = await getStoredProxy();
          if (currentProxy) {
            await testProxy(currentProxy.url, { testUrl });
            resolve(currentProxy);
          } else {
            const proxy = await getNewProxy();
            currentProxy = proxy;
            resolve(proxy);
          }
        } catch (err) {
          coraline.log(`The stored proxy is no more valid: ${errToString(err)}, gettin a new one...`);
          await coraline.rm(proxyFile);
          void handle();
        }
      };
      void handle();
    });
  };

  const reset = async () => {
    await coraline.clearFolder(directory);
  };

  return {
    /** Get a list of free proxies from the specified source. You can use the Source enum to see all the available sources. */
    getProxyList,
    /** Get a single free proxy, the proxy will be stored to the disk, If the proxy is no more valid, you can use provider.getNextProxy to remove it and get a new one. */
    getProxy,
    /** Find a new proxy that will replace the current one. */
    getNextProxy: async () => {
      if (!currentProxy) throw new Error('There is no current proxy, please use getProxy before trying to get a next one.');
      await addToSkip(currentProxy.url);
      await coraline.rm(proxyFile);
      return getProxy();
    },
    reset,
  };
};

const initDir = async (directory: string) => {
  try {
    await fs.access(directory);
  } catch {
    await fs.mkdir(directory);
  }
};

export type { Proxy, ProxyList } from './types.js';
export { Source, Protocol, AnonymityLevel } from './enums.js';
