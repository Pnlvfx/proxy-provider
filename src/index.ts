import { getHimeMeProxyList } from './proxies/hideip-me.js';
import { Protocol, Source } from './types.js';

// repo with a lot of good proxy sources
// https://github.com/yasirerkam/proxyOPI/blob/main/src/index.ts

export interface ProxyOptions {
  protocol?: Protocol;
  country?: string;
}

const getProxyList = (source: Source) => {
  if (source === Source.HIDEMEIP) {
    return getHimeMeProxyList();
  }
  throw new Error('Please provide a valid source');
};

const proxy = {
  getProxyList,
  getProxy: async ({ protocol, country }: ProxyOptions = {}) => {
    for (const [_i, provider] of Object.entries(Source)) {
      const proxies = await getProxyList(provider);
      const _proxy = proxies.find((pp) => pp.protocols.at(0) === protocol && pp.country === country);
      if (_proxy) return _proxy;
    }
    throw new Error('No proxy found with this options');
  },
  // implement store proxy and get stored proxy
};

export default proxy;

export { AnonymityLevel, Protocol, Proxy, ProxyList, Source } from './types.js';
