/* eslint-disable no-console */
import coraline from 'coraline';
import proxyProvider, { Source } from './index.js';

coraline.createScriptExec(
  async () => {
    const proxies = await proxyProvider.getProxyList(Source.HIDEMEIP);
    console.log(proxies);
  },
  { repeat: true },
);
