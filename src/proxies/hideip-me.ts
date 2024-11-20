import type { ProxyListOptions } from '../list.js';
import { AnonymityLevel, Protocol, Source } from '../enums.js';
import coraline from 'coraline';
import { Proxy } from '../types.js';

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
  for (const item of urls) {
    const res = await fetch(item.url, { method: 'GET', headers: { 'user-agent': coraline.getUserAgent() } });
    if (!res.ok) throw new Error(`checkerproxy error: ${res.status.toString()}: ${res.statusText}`);
    const txt = await res.text();
    const proxies = txt.split('\n');
    for (const proxy of proxies) {
      const cleanProxy = proxy.split(':');
      const ip = cleanProxy.at(0)?.trim();
      const port = cleanProxy.at(1)?.trim();
      const country = cleanProxy.at(2)?.trim();
      if (ip && port) {
        const url = `${item.protocol}://${ip}:${port}`;
        proxyList.push({
          url,
          ip,
          port,
          protocols: [item.protocol],
          sourceSite: Source.HIDEMEIP,
          anonymityLevel: AnonymityLevel.unknown,
          country,
        });
      }
    }
    break;
  }
  return proxyList;
};
