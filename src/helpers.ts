import type { Protocol, Proxy } from './geonode/types.js';
import { fetch, ProxyAgent } from 'undici';

export const makeProto = (proxy: Proxy) => {
  const urls = constructProxyUrls(proxy);

  return {
    ...proxy,
    urls,
  };
};

const testProxy = async (proxyUrl: string, { testUrl = 'https://api.ipify.org?format=json' }: { testUrl?: string } = {}) => {
  const agent = new ProxyAgent(proxyUrl);
  const res = await fetch(testUrl, { dispatcher: agent });
  if (!res.ok) throw new Error(`${res.status.toString()}: ${res.statusText}`);
};

export interface ProxyUrl {
  url: string;
  test: () => Promise<void>;
}

type ProxyUrls = Partial<Record<Protocol, ProxyUrl>>;

const constructProxyUrls = (proxy: Proxy) => {
  const urls: ProxyUrls = {};
  for (const protocol of proxy.protocols) {
    const url = `${protocol}://${proxy.ip}:${proxy.port.toString()}`;
    urls[protocol] = { url, test: () => testProxy(url) };
  }

  return urls;
};

export interface ProtoProxy extends Proxy {
  urls: ProxyUrls;
}
