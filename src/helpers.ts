import type { Protocol, Proxy } from './geonode/types.js';
import { fetch, ProxyAgent } from 'undici';

export const testProxy = async (proxyUrl: string, { testUrl = 'https://api.ipify.org?format=json' }: { testUrl?: string } = {}) => {
  console.log('Testing', proxyUrl);
  const agent = new ProxyAgent(proxyUrl);
  const res = await fetch(testUrl, { dispatcher: agent });
  if (!res.ok) throw new Error(`${res.status.toString()}: ${res.statusText}`);
};

export const constructProxyUrl = (proxy: Proxy, { protocol }: { protocol?: Protocol } = {}) => {
  const selectedProtocol = protocol ? proxy.protocols.find((p) => p === protocol) : proxy.protocols.at(0);
  if (!selectedProtocol) throw new Error('No protocol!');
  return `${selectedProtocol}://${proxy.ip}:${proxy.port.toString()}`;
};
