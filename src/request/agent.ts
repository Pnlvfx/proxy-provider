import { ProxyAgent } from 'undici';
import { proxyProvider, type ProviderOptions } from '../provider.js';

// experimental helper to help switching undici agents
export const createProxyAgent = (options: Omit<ProviderOptions, 'protocols'> = {}) => {
  const provider = proxyProvider({ ...options, protocols: 'http' });
  let agent: ProxyAgent | undefined;

  return {
    getCurrentAgent: async () => {
      if (agent) return agent;
      const proxy = await provider.getCurrentProxy();
      const url = proxy.urls.https ?? proxy.urls.http;
      if (!url) throw new Error('Invalid proxy received');
      agent = new ProxyAgent(url.url);
      return agent;
    },
    getNextAgent: async () => {
      const proxy = await provider.getNextProxy();
      const url = proxy.urls.https ?? proxy.urls.http;
      if (!url) throw new Error('Invalid proxy received');
      agent = new ProxyAgent(url.url);
      return agent;
    },
  };
};

export type AgentProvider = Awaited<ReturnType<typeof createProxyAgent>>;
