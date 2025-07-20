import type { Proxy } from './geonode/types.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import { storage } from '@goatjs/storage';
import { clearFolder, pathExist } from '@goatjs/node/fs';
import { getProxyList, type ProxyListParams } from './proxy.js';
import { makeProto } from './helpers.js';

export type ProviderOptions = ProxyListParams;

export const proxyProvider = async ({ country, protocols }: ProviderOptions = {}) => {
  const directory = await storage.use('.proxy');
  const proxyFile = path.join(directory, 'proxy.json');
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

  const addToSkip = async (ip: string) => {
    if (await pathExist(proxyFile)) {
      await fs.rm(proxyFile);
    }
    if (!skips.includes(ip)) {
      skips.push(ip);
      await fs.writeFile(skipFile, JSON.stringify(skips));
    }
  };

  const getStoredProxy = async () => {
    try {
      const buf = await fs.readFile(proxyFile);
      return JSON.parse(buf.toString()) as Proxy;
    } catch {
      return;
    }
  };

  const getNextProxy = async () => {
    if (currentProxy) {
      await addToSkip(currentProxy.ip);
    }
    let proxies = await getProxyList({ country, protocols });
    proxies = proxies.filter((p) => !skips.includes(p.ip));
    currentProxy = proxies.at(0);
    if (!currentProxy) throw new Error('No more available proxies.');
    await fs.writeFile(proxyFile, JSON.stringify(currentProxy));
    return currentProxy;
  };

  const getCurrentProxy = async () => {
    if (currentProxy) return currentProxy;
    currentProxy = (await getStoredProxy()) ?? (await getNextProxy());
    return currentProxy;
  };

  const reset = () => {
    return clearFolder(directory);
  };

  return {
    reset,
    /** Get a single free proxy, the proxy will be stored to the disk, If the proxy is no more valid, you can use provider.getNextProxy to remove it and get a new one. */
    getCurrentProxy: async () => {
      const proxy = await getCurrentProxy();
      return makeProto(proxy);
    },
    /** Find a new proxy that will replace the current one. */
    getNextProxy: async () => {
      const proxy = await getNextProxy();
      return makeProto(proxy);
    },
  };
};

export type ProxyProvider = Awaited<ReturnType<typeof proxyProvider>> | undefined;
