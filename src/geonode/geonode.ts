import { proxyResponse, type Protocol } from './types.js';

export interface ProxyOptions {
  limit?: number;
  page?: number;
  sort_by?: 'lastChecked';
  sort_type?: 'desc';
  protocols?: Protocol; // TODO [2025-09-30] not sure if i can use the join with comma, docs are not clear.
  /** Two letter country, eg: US */
  country?: string; // TODO [2025-09-30] not sure if i can use the join with comma, docs are not clear.
}

const BASE_URL = 'https://proxylist.geonode.com/api/proxy-list';

export const geonode = {
  getProxyList: async ({ limit = 500, page = 1, sort_by = 'lastChecked', sort_type = 'desc', protocols, country }: ProxyOptions = {}) => {
    const q = new URLSearchParams({ limit: limit.toString(), page: page.toString(), sort_by, sort_type });
    if (protocols) {
      // const arr = typeof protocols === 'string' ? [protocols] : protocols;
      // q.append('protocols', arr.join(','));
      q.append('protocols', protocols);
    }
    if (country) {
      // const arr = typeof country === 'string' ? [country] : country;
      // q.append('country', arr.join(','));
      q.append('country', country);
    }
    const res = await fetch(`${BASE_URL}?${q.toString()}`);
    if (!res.ok) throw new Error(`${res.status.toString()} ${res.statusText}`);
    const { data } = await proxyResponse.parseAsync(await res.json());
    return data;
  },
};
