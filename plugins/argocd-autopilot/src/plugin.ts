import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootCatalogArgocdAutopilotRouteRef } from './routes';

export const argocdAutopilotPlugin = createPlugin({
  id: 'argocd-autopilot',
  routes: {
    root: rootCatalogArgocdAutopilotRouteRef,
  },
});

export const EntityArgocdAutopilotContent = argocdAutopilotPlugin.provide(
  createRoutableExtension({
    name: 'EntityArgocdAutopilotContent',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootCatalogArgocdAutopilotRouteRef,
  }),
);
