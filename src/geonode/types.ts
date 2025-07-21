import z from 'zod';

const protocolSchema = z.literal(['http', 'https', 'socks4', 'socks5']);

const proxySchema = z.strictObject({
  _id: z.string(),
  ip: z.ipv4(),
  anonymityLevel: z.literal(['elite', 'transparent', 'anonymous']),
  asn: z.string().nullable(),
  city: z.string(),
  country: z.string(),
  created_at: z.string(),
  google: z.boolean(),
  hostName: z.null().optional(),
  isp: z.string(),
  lastChecked: z.number(),
  latency: z.number(),
  org: z.string().nullable(),
  port: z.number().or(z.string()),
  protocols: protocolSchema.array(),
  region: z.string().nullable().optional(),
  speed: z.number(),
  upTime: z.number(),
  upTimeSuccessCount: z.number(),
  upTimeTryCount: z.number(),
  updated_at: z.string(),
  workingPercent: z.null().optional(),
  responseTime: z.number(),
});

export const proxyResponse = z.strictObject({
  data: proxySchema.array(),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type Proxy = z.infer<typeof proxySchema>;
export type Protocol = z.Infer<typeof protocolSchema>;
