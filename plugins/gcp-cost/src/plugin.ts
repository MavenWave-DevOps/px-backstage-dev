import { createApiFactory, createPlugin, createRoutableExtension, discoveryApiRef } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { gcpcostApiRef } from './api';
import { bigqueryClient } from './api/bigqueryClient';

export const gcpCostPlugin = createPlugin({
  id: 'gcp-cost',
  apis: [
    createApiFactory({
      api: gcpcostApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
      }
    })
  ]
  routes: {
    root: rootRouteRef,
  },
});

export const GcpCostPage = gcpCostPlugin.provide(
  createRoutableExtension({
    name: 'GcpCostPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
