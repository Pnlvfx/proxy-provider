export enum Protocol {
  http = 'http',
  https = 'https',
  socks4 = 'socks4',
  socks5 = 'socks5',
  unknown = 'unknown',
}

export enum AnonymityLevel {
  transparent = 'transparent',
  anonymous = 'anonymous',
  elite = 'elite',
  unknown = 'unknown',
}

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

export enum Source {
  HIDEMEIP = 'hideip.me',
  CHECKERPROXY = 'checkerproxy.net',
}
