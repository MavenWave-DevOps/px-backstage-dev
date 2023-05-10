import { CatalogClient } from '@backstage/catalog-client';
import { createRouter, createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
// import {
  // cloneAzureRepoAction,
//   pushAzureRepoAction
// } from "@parfuemerie-douglas/scaffolder-backend-module-azure-repositories";
import type { PluginEnvironment } from '../types';
import { ScmIntegrations } from '@backstage/integration';
import * as clone from './scaffolder/actions/cloneADORepo';
import * as commit from './scaffolder/actions/commitAndPushADOBranch';
import * as pr from './scaffolder/actions/createAzurePullRequest';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });
  const integrations = ScmIntegrations.fromConfig(env.config)

  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [
    clone.cloneAzureRepoAction({ integrations }),
    commit.commitAndPushADOBranch({ integrations, config: env.config }),
    pr.createAzurePullRequest({ integrations }),
    // pushAzureRepoAction({ integrations, config: env.config }),
    ...builtInActions
  ]

  return await createRouter({
    actions,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    identity: env.identity,
  });
}
