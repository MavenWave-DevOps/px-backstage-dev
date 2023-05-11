import { CatalogClient } from '@backstage/catalog-client';
import { createBuiltinActions, createRouter } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { ScmIntegrations } from "@backstage/integration";
import { cloneAdRepoAction, pushAdRepoAction } from './scaffolder/actions';
import { createHttpBackstageAction } from './scaffolder/actions/execute/createPullRequest';
// import { commitAndPushADOBranch } from './scaffolder/actions/execute/createPullRequest';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  const integrations = ScmIntegrations.fromConfig(env.config);

  const actions = [
    cloneAdRepoAction({ integrations }),
    pushAdRepoAction({ integrations, config: env.config }),
    createHttpBackstageAction({discovery: env.discovery}),
    // commitAndPushADOBranch({ integrations, config: env.config }),
    ...createBuiltinActions({
      catalogClient,
      config: env.config,
      reader: env.reader,
      integrations,

    }),
  ];

  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    identity: env.identity,
    catalogClient,
    actions,
  });



}
