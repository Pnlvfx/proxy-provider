/* eslint-disable no-console */
import coraline from 'coraline';
import { proxyProvider, Protocol, Source } from './provider.js';

const run = async () => {
  const input = await coraline.input.create({ title: '1 to test the getProxy or 2 to test the getProxyList' });
  const provider = await proxyProvider('.test', { protocol: Protocol.http });
  switch (input) {
    case '1': {
      const proxy = await provider.getProxy();
      console.log(proxy);
      break;
    }
    case '2': {
      const proxies = await provider.getProxyList(Source.CHECKERPROXY, { protocol: Protocol.http });
      coraline.log(proxies);
      break;
    }
    default: {
      console.log('Invalid input provided.');
    }
  }
  void run();
};

void run();
