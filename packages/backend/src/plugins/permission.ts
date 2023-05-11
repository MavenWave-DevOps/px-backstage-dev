import { createRouter } from '@backstage/plugin-permission-backend';
import {
    AuthorizeResult, PolicyDecision, isPermission,
} from '@backstage/plugin-permission-common';
import { PermissionPolicy, PolicyQuery, } from '@backstage/plugin-permission-node';

import { catalogConditions, createCatalogConditionalDecision, } from '@backstage/plugin-catalog-backend/alpha';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common/alpha';

class accessPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse
  ):Promise<PolicyDecision> {
    if(isPermission(request.permission,catalogEntityReadPermission)){
      if(user?.identity.ownershipEntityRefs.includes('group:default/platform_admin')){
        return{result: AuthorizeResult.ALLOW}
      }

      if(user?.identity.ownershipEntityRefs.includes('group:default/businessb') || user?.identity.ownershipEntityRefs.includes('group:default/business_a') ){
        return{result: AuthorizeResult.ALLOW}
      }
      

      return createCatalogConditionalDecision(
        request.permission, {
        anyOf: [
          {
            allOf: [
              catalogConditions.isEntityKind({kinds:['template']}),
              catalogConditions.isEntityOwner({
                claims: user?.identity.ownershipEntityRefs ?? [],
              }),
            ],
          },
        ],
      });
    }
    return { result: AuthorizeResult.ALLOW };
  }
}

export default async function createPlugin(
    env: PluginEnvironment,
): Promise<Router> {
    return await createRouter({
        config: env.config,
        logger: env.logger,
        discovery: env.discovery,
        policy: new accessPolicy(),
        identity: env.identity,
    });
}
