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

const proxyProvider = {
  getProxyList,
  getProxy: async ({ protocol, country }: ProxyOptions = {}) => {
    for (const [_i, provider] of Object.entries(Source)) {
      let proxies = await getProxyList(provider);
      if (protocol) {
        proxies = proxies.filter((pp) => pp.protocols.includes(protocol));
      }
      if (country) {
        proxies = proxies.filter((pp) => pp.country === country);
      }
      if (proxies[0]) return proxies[0];
    }
    throw new Error('No proxy found with this options');
  },
  // implement store proxy and get stored proxy
};

export default proxyProvider;

export { AnonymityLevel, Protocol, Proxy, ProxyList, Source } from './types.js';
