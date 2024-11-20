/* eslint-disable no-console */
import coraline from 'coraline';
import { proxyProvider, Protocol, Source } from './provider.js';

const run = async () => {
  const test = await coraline.input.create({ title: 'Insert 1 to test the getProxy or 2 to test the getProxyList' });
  if (test === '1') {
    const proxy = await proxyProvider.getProxy({ protocol: Protocol.http, country: ['United States'] });
    console.log(proxy);
  } else if (test === '2') {
    const proxies = await proxyProvider.getProxyList(Source.CHECKERPROXY, { protocol: Protocol.http });
    coraline.log(proxies);
  } else {
    throw new Error('Invalid input provided.');
  }
};

const repeat = async () => {
  try {
    await run();
    await run();
  } catch (err) {
    console.log(err);
    await run();
  }
};

repeat();
