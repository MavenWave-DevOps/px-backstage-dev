import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { ScmIntegrations } from '@backstage/integration';
import { createNewFileAction } from './scaffolder/actions/custom';
import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import {createHttpBackstageAction} from "@roadiehq/scaffolder-backend-module-http-request";

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });
  const integrations = ScmIntegrations.fromConfig(env.config);
  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [
    ...builtInActions,
    createNewFileAction(),
    createHttpBackstageAction({config: env.config}),
    ...createBuiltinActions({
        integrations,
        config: env.config,
        catalogClient,
        reader: env.reader,
    }),
  ];

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
