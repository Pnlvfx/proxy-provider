import type { Proxy, ProxyListOptions } from '../types.js';
import { AnonymityLevel, Protocol, Source } from '../enums.js';

interface ProxyCheckerPN {
  id?: number;
  local_id?: number;
  report_id?: string;
  addr: string;
  type?: number; // 1: http, 2: https, 4: socks5, 5: http/https, 7: ALL ACTIVE,
  kind?: number; // 0: transparent, 2: anonymous, 3: ALL KINDS
  timeout?: number;
  cookie?: boolean;
  referer?: boolean;
  post?: boolean;
  ip?: string;
  addr_geo_iso?: string;
  addr_geo_country?: string;
  addr_geo_city?: string;
  ip_geo_iso?: string;
  ip_geo_country?: string;
  ip_geo_city?: string;
  created_at?: string;
  updated_at?: string;
  skip?: boolean;
  from_cache?: boolean;
}

export const getCheckerProxyNexProxyList = async ({ protocol }: ProxyListOptions = {}) => {
  const url = 'https://checkerproxy.net/api/archive/' + new Date().toJSON().slice(0, 10);
  const proxyList: Proxy[] = [];
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: '*/*',
      'accept-language': 'en,en-US;q=0.9,tr-TR;q=0.8,tr;q=0.7',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      Referer: url,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  });
  if (!res.ok) throw new Error(`checkerproxy error: ${res.status.toString()}: ${res.statusText}`);
  const proxies = (await res.json()) as ProxyCheckerPN[];
  for (const proxy of proxies) {
    const [ip, port] = proxy.addr.split(':');
    const protocols: Protocol[] = transformProtocol(proxy.type ?? 0);
    const kind = transformAnonymityLevel(proxy.kind ?? 0);
    const proxyProtocol = protocols.at(0);
    if (!ip || !port || !proxyProtocol) continue;
    if (protocol) {
      if (Array.isArray(protocol)) {
        if (!protocol.includes(proxyProtocol)) continue;
      } else if (protocol !== proxyProtocol) continue;
    }
    const url = `${proxyProtocol}://${ip}:${port}`;
    proxyList.push({
      url,
      ip,
      port,
      protocols,
      sourceSite: Source.CHECKERPROXY,
      anonymityLevel: kind,
      country: proxy.addr_geo_iso,
      city: proxy.addr_geo_city,
      lastTested: proxy.updated_at,
    });
  }
  return proxyList;
};

const transformProtocol = (type: number) => {
  switch (type) {
    case 1: {
      return [Protocol.http];
    }
    case 2: {
      return [Protocol.https];
    }
    case 4: {
      return [Protocol.socks5];
    }
    case 5: {
      return [Protocol.http, Protocol.https];
    }
    case 7: {
      return [Protocol.http, Protocol.https, Protocol.socks5];
    }
    default: {
      return [Protocol.unknown];
    }
  }
};

const transformAnonymityLevel = (kind: number) => {
  switch (kind) {
    case 0: {
      return AnonymityLevel.transparent;
    }
    case 2: {
      return AnonymityLevel.anonymous;
    }
    case 3: {
      return AnonymityLevel.anonymous;
    }
    default: {
      return AnonymityLevel.unknown;
    }
  }
};
