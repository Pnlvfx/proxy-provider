import { ProxyAgent } from 'undici';
import { proxyProvider, type ProviderOptions } from '../provider.js';

// experimental helper to help switching undici agents
export const createProxyAgent = async (options: Omit<ProviderOptions, 'protocols'> = {}) => {
  const provider = await proxyProvider({ protocols: 'http', ...options });
  let agent: ProxyAgent | undefined;

  return {
    reset: provider.reset,
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
    },
  };
};

export type AgentProvider = Awaited<ReturnType<typeof createProxyAgent>>;
