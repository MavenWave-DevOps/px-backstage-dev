import {
    configApiRef,
    createApiFactory,
    createPlugin,
    createRoutableExtension,
    discoveryApiRef,
} from '@backstage/core-plugin-api';
import { ArgocdAutopilotBackendClient } from "./api/ArgocdAutopilotBackendClient";
import  { argocdAutopilotApiRef } from "./api/types"
import { rootCatalogArgocdAutopilotRouteRef } from './routes';

export const argocdAutopilotPlugin = createPlugin({
  id: 'argocd-autopilot',
  apis: [
    createApiFactory({
        api: argocdAutopilotApiRef,
        deps: {
            discoveryApi: discoveryApiRef,
            configApi: configApiRef,
        },
        factory: ({ discoveryApi, configApi }) =>
            new ArgocdAutopilotBackendClient({
                discoveryApi,
                apiUrl: configApi.getString('argocdAutopilot.apiUrl'),
            }),
    }),
  ],
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
