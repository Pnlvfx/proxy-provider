/* eslint-disable no-console */
import coraline from 'coraline';
import proxyProvider, { Protocol } from './index.js';

coraline.createScriptExec(
  async () => {
    const proxies = await proxyProvider.getProxy({ protocol: Protocol.http, country: 'United States' });
    console.log(proxies);
  },
  { repeat: true },
);
