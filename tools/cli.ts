/* eslint-disable no-console */

import { input } from '@goatjs/node/input';
import { Protocol, proxyProvider, Source } from '../src/provider.js';

const run = async () => {
  const text = await input.create({ title: '1 to test the getProxy or 2 to test the getProxyList' });
  const provider = await proxyProvider({ protocol: Protocol.http });
  switch (text) {
    case '1': {
      const proxy = await provider.getProxy();
      console.log(proxy);
      break;
    }
    case '2': {
      const proxies = await provider.getProxyList(Source.CHECKERPROXY, { protocol: Protocol.http });
      console.log(proxies);
      break;
    }
    default: {
      console.log('Invalid input provided.');
    }
  }
  await run();
};

await run();
