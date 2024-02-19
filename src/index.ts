import { getHideMeProxyList } from './proxies/hideip-me.js';
import { Protocol, Source } from './types.js';
import https from 'node:https';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';

// repo with a lot of good proxy sources
// https://github.com/yasirerkam/proxyOPI/blob/main/src/index.ts

export interface ProxyOptions {
  protocol?: Protocol;
  country?: string;
}

const getProxyList = (source: Source) => {
  if (source === Source.HIDEMEIP) {
    return getHideMeProxyList();
  }
  throw new Error('Please provide a valid source');
};

const testProxy = (proxyUrl: string) => {
  return new Promise<string>((resolve, reject) => {
    const Agent = proxyUrl.startsWith('https') ? HttpsProxyAgent : HttpProxyAgent;
    const agent = new Agent(proxyUrl);
    https.get('https://api.ipify.org?format=json', { agent }, (res) => {
      if (!res.statusCode?.toString().startsWith('2')) {
        reject(`${res.statusCode}: ${res.statusMessage}`);
      }
      res.on('error', reject);
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => resolve(data.toString()));
    });
  });
};

const proxyProvider = {
  /** Get a list of free proxies from the specified source. You can use the Source enum to see all the available sources. */
  getProxyList,
  /** Get a single free proxy. */
  getProxy: async ({ protocol, country }: ProxyOptions = {}) => {
    for (const [_i, provider] of Object.entries(Source)) {
      let proxies = await getProxyList(provider);
      if (protocol) {
        proxies = proxies.filter((pp) => pp.protocols.includes(protocol));
      }
      if (country) {
        proxies = proxies.filter((pp) => pp.country === country);
      }
      for (const proxy of proxies) {
        try {
          await testProxy(proxy.url);
          return proxy;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(err);
        }
      }
    }
    throw new Error('No proxy found with this options');
  },
  // implement store proxy and get stored proxy
};

export default proxyProvider;

export { AnonymityLevel, Protocol, Proxy, ProxyList, Source } from './types.js';
