import { createApiRef } from '@backstage/core-plugin-api';

export interface MyPluginApi {
  getHealth(): Promise<{ status: string; }>;
}

export const myPluginApiRef = createApiRef<MyPluginApi>({
  id: 'plugin.my-plugin.service',
});

