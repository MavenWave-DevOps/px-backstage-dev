import { createApiRef } from '@backstage/core-plugin-api';

export interface ArgocdAutopilotApi {
    PostArgoApi(action: string): Promise<{ status: string; }>;
}

export const argocdAutopilotApiRef = createApiRef<ArgocdAutopilotApi>({
    id: 'plugin.argocd-autopilot.service',
});