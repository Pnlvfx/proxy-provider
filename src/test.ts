import { fetch, ProxyAgent } from 'undici';

export const testProxy = async (proxyUrl: string) => {
  const agent = new ProxyAgent(proxyUrl);
  const res = await fetch('https://api.ipify.org?format=json', { dispatcher: agent });
  if (!res.ok) throw new Error(`${res.status.toString()}: ${res.statusText}`);
};
