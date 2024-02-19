import coraline, { consoleColor } from 'coraline';
import { ProxyOptions, getProxyList } from './provider.js';
import { Source } from './types.js';
import { HttpsProxyAgent } from 'https-proxy-agent';
import https from 'node:https';

export const testProxy = (proxyUrl: string) => {
  return new Promise<string>((resolve, reject) => {
    const agent = new HttpsProxyAgent(proxyUrl);
    const req = https.get('https://api.ipify.org?format=json', { agent }, (res) => {
      if (!res.statusCode?.toString().startsWith('2')) {
        reject(`${res.statusCode}: ${res.statusMessage}`);
        return;
      }
      res.on('error', reject);
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        clearTimeout(requestTimeout);
        resolve(data.toString());
      });
    });
    req.on('error', (err) => {
      clearTimeout(requestTimeout);
      reject(err);
    });
    const requestTimeout = setTimeout(() => {
      req.destroy();
      reject('Request timed out');
    }, 5000);
  });
};

const getNewProxy = async ({ protocol, country }: ProxyOptions = {}) => {
  for (const [_i, provider] of Object.entries(Source)) {
    let proxies = await getProxyList(provider, { protocol });
    if (country) {
      proxies = proxies.filter((pp) => pp.country === country);
    }
    for (const proxy of proxies) {
      try {
        await testProxy(proxy.url);
        return proxy;
      } catch (err) {
        consoleColor('red', 'Proxy test failed:', err, 'Skiping...');
      }
    }
  }
  throw new Error('No proxy found with this options');
};

export const getProxy = async ({ protocol, country, reset }: ProxyOptions & { reset?: boolean }) => {
  if (reset) {
    await coraline.cache.clear('proxy');
  }
  return coraline.cache.use('proxy', () => getNewProxy({ protocol, country }), { store: true });
};
