import { proxyResponse } from './types.js';

interface ProxyOptions {
  limit?: number;
  page?: number;
  sort_by?: 'lastChecked';
  sort_type?: 'desc';
}

const BASE_URL = 'https://proxylist.geonode.com/api/proxy-list';

export const geonode = {
  getProxyList: async ({ limit = 500, page = 1, sort_by = 'lastChecked', sort_type = 'desc' }: ProxyOptions = {}) => {
    const q = new URLSearchParams({ limit: limit.toString(), page: page.toString(), sort_by, sort_type });
    const res = await fetch(`${BASE_URL}?${q.toString()}`);
    if (!res.ok) throw new Error(`${res.status.toString()} ${res.statusText}`);
    const { data } = await proxyResponse.parseAsync(await res.json());
    return data;
  },
};
