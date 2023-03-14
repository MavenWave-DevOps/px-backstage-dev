import { createRouter } from '@internal/plugin-example-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  //This is where all init code for backend plugin needs to start
  // This is an env but only contains a logger
  return await createRouter({
    logger: env.logger,
    identity: env.identity,
  });
}
