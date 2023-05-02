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

const { token } = await this.tokenManager.getToken();
const response = await fetch(pluginBackendApiUrl, {
  method: 'GET',
  headers: {
    ...headers,
    Authorization: `Bearer ${token}`
  },
});

class TestPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse
  ):Promise<PolicyDecision> {
    await tokenManager.authenticate(token);
    if (isPermission(request.permission, catalogEntityReadPermission)) {
      
      if(user?.identity.ownershipEntityRefs.includes('group:default/PlatformAdmin')){
        return{result: AuthorizeResult.ALLOW}
      }

      /**
       *  To-Do: few more conditional block for other groups to allow/Deny access on templates
       */

      return createCatalogConditionalDecision(
        request.permission, {
        anyOf: [
          {
            allOf: [
              catalogConditions.isEntityKind({kinds:['template']}),
              catalogConditions.isEntityOwner({
                claims: user?.identity.ownershipEntityRefs ?? ['Group'],
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
        policy: new TestPermissionPolicy(),
        identity: env.identity,
    });
}
