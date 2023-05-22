// import {
//   // ClusterDetails,
//   KubernetesBuilder
//   // KubernetesClustersSupplier
// } from '@backstage/plugin-kubernetes-backend';
// import { Router } from 'express';
// import { PluginEnvironment } from '../types';
// import { CatalogClient } from '@backstage/catalog-client';
// import { Duration } from 'luxon';

import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { CatalogClient } from '@backstage/catalog-client';

export default async function createPlugin(
    env: PluginEnvironment,
): Promise<Router> {
  const catalogApi = new CatalogClient({ discoveryApi: env.discovery });
  const { router } = await KubernetesBuilder.createBuilder({
    logger: env.logger,
    config: env.config,
    catalogApi,
    permissions: env.permissions,
  }).build();
  return router;
}

// export class CustomClustersSupplier implements KubernetesClustersSupplier {
//   constructor(private clusterDetails: ClusterDetails[] = []) {}
//
//   static create(refreshInterval: Duration) {
//     const clusterSupplier = new CustomClustersSupplier();
//     runPeriodically(
//         () => clusterSupplier.refreshClusters(),
//         refreshInterval.toMillis(),
//     );
//     return clusterSupplier;
//   }
//
//   async refreshClusters(): Promise<void> {
//     this.clusterDetails = [];
//   }
//
//   async getClusters(): Promise<ClusterDetails[]> {
//     return this.clusterDetails;
//   }
// }
//
// export default async function createPlugin(
//   env: PluginEnvironment,
// ): Promise<Router> {
//   const catalogApi = new CatalogClient({ discoveryApi: env.discovery });
//   const builder = await KubernetesBuilder.createBuilder({
//     logger: env.logger,
//     config: env.config,
//     catalogApi,
//     permissions: env.permissions,
//   });
//   builder.setClusterSupplier(
//       CustomClustersSupplier.create(Duration.fromObject({ minutes: 60 })),
//   );
//   const { router } = await builder.build();
//
//   return router;
// }

