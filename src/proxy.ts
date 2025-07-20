import type { Protocol, Proxy } from './geonode/types.js';
import { geonode } from './geonode/geonode.js';

let proxyList: Proxy[] | undefined;

// todo allow for multiple countryes or protocols
interface ProxyListParams {
  country?: string;
  protocol?: Protocol;
}

export const getProxyList = async ({ country, protocol }: ProxyListParams = {}) => {
  if (!proxyList) {
    proxyList = await geonode.getProxyList();
    if (protocol) {
      proxyList = proxyList.filter((i) => i.protocols.includes(protocol));
    }
    if (country) {
      proxyList = proxyList.filter((i) => i.country === country);
    }
  }

  return proxyList;
};
