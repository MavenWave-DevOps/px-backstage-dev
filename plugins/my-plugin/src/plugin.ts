import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { MyPluginBackendClient } from './api/MyPluginBackendClient';
import {myPluginApiRef } from './api/types';
import { rootCatalogMyPluginRouteRef } from './routes';

export const myPluginPlugin = createPlugin({
  id: 'my-plugin',
  apis: [
    createApiFactory({
      api: myPluginApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
      },
      factory: ({ discoveryApi }) =>
        new MyPluginBackendClient({ discoveryApi }),
    }),
  ],
  routes: {
    root: rootCatalogMyPluginRouteRef,
  },
});

export const EntityMyPluginContent = myPluginPlugin.provide(
  createRoutableExtension({
    name: 'EntityMyPluginContent',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootCatalogMyPluginRouteRef,
  }),
);
