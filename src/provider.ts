import type { Proxy } from './geonode/types.js';
import { makeProto } from './helpers.js';
import { geonode, type ProxyOptions } from './geonode/geonode.js';

export type ProviderOptions = ProxyOptions;

const LIMIT = 500;

export const proxyProvider = ({ country, protocols }: ProviderOptions = {}) => {
  const proxyList: Proxy[] = [];
  let currentProxy = 0;
  let currentPage = 0;

  const getNextProxy = async () => {
    if (currentProxy === proxyList.length - 1) {
      currentPage += 1;
      proxyList.push(...(await geonode.getProxyList({ country, protocols, limit: LIMIT, page: currentPage })));
    }
    currentProxy += 1;
    const proxy = proxyList.at(currentProxy);
    if (!proxy) throw new Error('No more available proxies.');
    return proxy;
  };

  const getCurrentProxy = async () => {
    const proxy = proxyList.at(currentProxy);
    return proxy ?? getNextProxy();
  };

  return {
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
