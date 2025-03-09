import type { ProxyListOptions } from './types.js';
import { Source } from './enums.js';
import { getCheckerProxyNexProxyList } from './proxies/checkerproxy-net.js';
import { getHideMeProxyList } from './proxies/hideip-me.js';

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
