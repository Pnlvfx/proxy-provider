import { getCheckerProxyNexProxyList } from './proxies/checkerproxy-net.js';
import { getHideMeProxyList } from './proxies/hideip-me.js';
import { Protocol, Source } from './types.js';

export interface ProxyOptions {
  protocol?: Protocol;
  country?: string;
}

export interface ProxyListOptions {
  protocol?: Protocol | Protocol[];
}

export const getProxyList = (source: Source, options?: ProxyListOptions) => {
  if (source === Source.HIDEMEIP) {
    return getHideMeProxyList(options);
  } else if (source === Source.CHECKERPROXY) {
    return getCheckerProxyNexProxyList(options);
  }
  throw new Error('Please provide a valid source');
};
