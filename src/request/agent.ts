import { ProxyAgent } from 'undici';
import { proxyProvider, type ProviderOptions } from '../provider.js';

// experimental helper to help switching undici agents
export const createProxyAgent = async (options: ProviderOptions = {}) => {
  const provider = await proxyProvider(options);
  let agent: ProxyAgent | undefined;

  return {
    getCurrentAgent: async () => {
      if (agent) return agent;
      const proxy = await provider.getCurrentProxy();
      agent = new ProxyAgent(proxy.ip);
      return agent;
    },
    getNextAgent: async () => {
      const proxy = await provider.getNextProxy();
      agent = new ProxyAgent(proxy.ip);
    },
  };
};

export type AgentProvider = Awaited<ReturnType<typeof createProxyAgent>>;
