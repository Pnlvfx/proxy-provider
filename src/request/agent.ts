import { ProxyAgent } from 'undici';
import { proxyProvider } from '../provider.js';

// experimental helper to help switching undici agents
// TODO because we should decide if keep it or not
export const createProxyAgent = async () => {
  const provider = await proxyProvider();
  let agent: ProxyAgent | undefined;

  return {
    getCurrentAgent: async () => {
      if (agent) return agent;
      const proxy = await provider.getCurrentProxy();
      agent = new ProxyAgent(proxy.url);
      return agent;
    },
    getNextAgent: async () => {
      const proxy = await provider.getNextProxy();
      agent = new ProxyAgent(proxy.url);
    },
  };
};
