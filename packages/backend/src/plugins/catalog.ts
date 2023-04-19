import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { AzureDevOpsEntityProvider, AzureDevOpsDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-azure';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  /**
   * ADO entity provider
   */
  AzureDevOpsEntityProvider.fromConfig(env.config, { logger: env.logger, schedule: env.scheduler.createScheduledTaskRunner({ frequency: { minutes: 20 }, timeout: { minutes: 2 }, }), }),
    
  /**
   * ADO discovery process
   */
    builder.addProcessor(AzureDevOpsDiscoveryProcessor.fromConfig(env.config, { logger: env.logger, }),);
  
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
