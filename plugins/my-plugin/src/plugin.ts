import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootCatalogMyPluginRouteRef } from './routes';

export const myPluginPlugin = createPlugin({
  id: 'my-plugin',
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
