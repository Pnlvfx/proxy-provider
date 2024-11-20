import { fetch, ProxyAgent } from 'undici';

export const testProxy = async (proxyUrl: string, { testUrl = 'https://api.ipify.org?format=json' }: { testUrl?: string } = {}) => {
  const agent = new ProxyAgent(proxyUrl);
  const res = await fetch(testUrl, { dispatcher: agent });
  if (!res.ok) throw new Error(`${res.status.toString()}: ${res.statusText}`);
};

export const isWorking = async (proxyUrl: string) => {
  try {
    await testProxy(proxyUrl);
    return true;
  } catch {
    return false;
  }
};
