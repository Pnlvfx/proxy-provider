/* eslint-disable no-console */
import coraline from 'coraline';
import { proxyProvider, Protocol, Source } from './provider.js';

const run = async () => {
  const input = await coraline.input.create({ title: 'Insert 1 to test the getProxy or 2 to test the getProxyList' });
  switch (input) {
    case '1': {
      const proxy = await proxyProvider.getProxy({ protocol: Protocol.http, country: ['United States'] });
      console.log(proxy);
      break;
    }
    case '2': {
      const proxies = await proxyProvider.getProxyList(Source.CHECKERPROXY, { protocol: Protocol.http });
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
