import { type Cache, consoleColor } from 'coraline';
import { getProxyList } from './list.js';
import { Protocol, Source } from './types.js';
import { testProxy } from './test.js';

/** @TODO Implement a way to get next proxy if the current fail. */

export interface ProxyOptions {
  protocol?: Protocol;
  country?: string[];
}

const getNewProxy = async ({ protocol, country }: ProxyOptions) => {
  for (const [_i, provider] of Object.entries(Source)) {
    let proxies = await getProxyList(provider, { protocol });
    if (country) {
      proxies = proxies.filter((pp) => pp.country && country.includes(pp.country));
    }
    for (const proxy of proxies) {
      try {
        await testProxy(proxy.url);
        return proxy;
      } catch (err) {
        consoleColor('red', 'Proxy test failed:', err, 'Skiping...');
      }
    }
  }
  throw new Error('No proxy found with this options');
};

export const isWorking = async (proxyUrl: string) => {
  try {
    await testProxy(proxyUrl);
    return true;
  } catch {
    return false;
  }
};

export const getProxy = async ({ protocol, country, cache }: ProxyOptions & { cache: Cache }) => {
  const data = await cache.use('proxy', () => getNewProxy({ protocol, country }), { store: true });
  try {
    await testProxy(data.url);
    return data;
  } catch {
    consoleColor('red', `The stored proxy is no more valid, gettin a new one...`);
    await cache.clear('proxy');
    return cache.use('proxy', () => getNewProxy({ protocol, country }), { store: true });
  }
};
