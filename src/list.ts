import { getCheckerProxyNexProxyList } from './proxies/checkerproxy-net.js';
import { getHideMeProxyList } from './proxies/hideip-me.js';
import { Protocol, Source } from './types.js';

export interface ProxyListOptions {
  protocol?: Protocol | Protocol[];
}

export const getProxyList = (source: Source, options?: ProxyListOptions) => {
  switch (source) {
    case Source.HIDEMEIP: {
      return getHideMeProxyList(options);
    }
    case Source.CHECKERPROXY: {
      return getCheckerProxyNexProxyList(options);
    }
    default: {
      throw new Error('Please provide a valid source');
    }
  }
};
