import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { 
  cloneAzureRepoAction,
  pushAzureRepoAction
} from "@parfuemerie-douglas/scaffolder-backend-module-azure-repositories";
// import { createAzurePullRequest } from '../../../../../../custom/backstage-plugin-scaffolder-backend-module-azure-devops-repositories/src/actions/run/createAzurePullRequest';
import type { PluginEnvironment } from '../types';
import { ScmIntegrations } from '@backstage/integration';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  const integrations = ScmIntegrations.fromConfig(env.config)

  const actions = [
    cloneAzureRepoAction({ integrations }),
    pushAzureRepoAction({ integrations, config: env.config }),
    // ...createBuiltInActions({
    //   containerRunner,
    //   catalogClient,
    //   integrations,
    //   config: env.config,
    //   reader: env.reader,
    // }),
  ]

  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    identity: env.identity,
  });
}
