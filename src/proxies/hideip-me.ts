import type { ProxyListOptions } from '../provider.js';
import coraline from 'coraline';
import { AnonymityLevel, Protocol, Proxy, Source } from '../types.js';

const proxyUrls = [
  { url: 'https://raw.githubusercontent.com/zloi-user/hideip.me/main/http.txt', protocol: Protocol.http },
  { url: 'https://raw.githubusercontent.com/zloi-user/hideip.me/main/https.txt', protocol: Protocol.https },
  { url: 'https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks4.txt', protocol: Protocol.socks4 },
  { url: 'https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks5.txt', protocol: Protocol.socks5 },
];

const getUrls = (protocol?: Protocol | Protocol[]) => {
  if (protocol) {
    return Array.isArray(protocol) ? proxyUrls.filter((a) => protocol.includes(a.protocol)) : proxyUrls.filter((a) => a.protocol === protocol);
  } else {
    return proxyUrls;
  }
};

export const getHideMeProxyList = async ({ protocol }: ProxyListOptions = {}) => {
  const urls = getUrls(protocol);
  const proxyList: Proxy[] = [];
  for (const { url, protocol } of urls) {
    const res = await fetch(url, { method: 'GET', headers: { 'User-Agent': coraline.getUserAgent() } });
    if (!res.ok) throw new Error(`checkerproxy error: ${res.status}: ${res.statusText}`);
    const txt = await res.text();
    const proxies = txt.split('\n');
    proxies.map((proxy) => {
      const cleanProxy = proxy.split(':');
      const ip = cleanProxy.at(0)?.trim();
      const port = cleanProxy.at(1)?.trim();
      const country = cleanProxy.at(2)?.trim();
      if (ip && port) {
        proxyList.push({
          url: `${protocol}://${ip}:${port}`,
          ip,
          port,
          protocols: [protocol],
          sourceSite: Source.HIDEMEIP,
          anonymityLevel: AnonymityLevel.unknown,
          country,
        });
      }
    });
    break;
  }
  return proxyList;
};
