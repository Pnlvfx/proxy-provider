/* eslint-disable no-console */

import type { ProtoProxy } from '../src/helpers.js';
import { input } from '@goatjs/node/input';
import { proxyProvider } from '../src/provider.js';
import { geonode } from '../src/geonode/geonode.js';
import { setTimeout } from 'node:timers/promises';

const run = async () => {
  try {
    const text = await input.create({ title: '1. getProxy\n2. getProxyList' });
    const provider = await proxyProvider({ protocols: 'http' });
    await provider.reset();
    switch (text) {
      case '1': {
        const proxy = await provider.getCurrentProxy();
        await new Promise<void>((resolve) => {
          const makeRequest = async (p: ProtoProxy) => {
            try {
              const url = p.urls.https ?? p.urls.http;
              if (!url) throw new Error('No valid proxy found!');
              await url.test();
              resolve();
            } catch (err) {
              console.log(err);
              await setTimeout(30);
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
