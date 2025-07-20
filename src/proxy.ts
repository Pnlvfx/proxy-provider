import type { Protocol, Proxy } from './geonode/types.js';
import { geonode } from './geonode/geonode.js';

let proxyList: Proxy[] | undefined;

export interface ProxyListParams {
  protocols?: Protocol;
  country?: string;
}

export const getProxyList = async ({ country, protocols }: ProxyListParams = {}) => {
  proxyList ??= await geonode.getProxyList({ country, protocols });
  return proxyList;
};
