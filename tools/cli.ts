/* eslint-disable no-console */

import { input } from '@goatjs/node/input';
import { proxyProvider } from '../src/provider.js';
import { constructProxyUrl, testProxy } from '../src/helpers.js';
import type { Proxy } from '../src/geonode/types.js';
import { geonode } from '../src/geonode/geonode.js';

const run = async () => {
  try {
    const text = await input.create({ title: '1. getProxy\n2. getProxyList' });
    const provider = await proxyProvider({ protocol: 'http', debug: true });
    switch (text) {
      case '1': {
        const proxy = await provider.getCurrentProxy();
        await new Promise<void>((resolve) => {
          const makeRequest = async (p: Proxy) => {
            try {
              await testProxy(constructProxyUrl(p, { protocol: 'http' }));
              resolve();
            } catch (err) {
              console.log(err);
              await makeRequest(await provider.getNextProxy());
              resolve();
            }
          };

          void makeRequest(proxy);
        });
        break;
      }
      case '2': {
        const proxies = await geonode.getProxyList();
        console.log(proxies);
        break;
      }
      default: {
        console.log('Invalid input provided.');
      }
    }
  } catch (err) {
    console.error(err);
  }

  void run();
};

await run();
