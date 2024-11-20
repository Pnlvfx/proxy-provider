import { AnonymityLevel, Protocol } from './enums.js';

export interface Proxy {
  isWorking: () => Promise<boolean>;
  url: string;
  ip: string;
  port: string;
  protocols: Protocol[];
  sourceSite: string;
  anonymityLevel?: AnonymityLevel;
  lastTested?: string;
  country?: string;
  city?: string;
  isp?: string;
  speed?: string;
  uptime?: string;
  responseTime?: string;
  verified?: string;
}

export interface ProxyList {
  dateTime: number;
  list: Proxy[];
}
