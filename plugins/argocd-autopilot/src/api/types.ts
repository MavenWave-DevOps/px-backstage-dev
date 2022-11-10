import { createApiRef } from '@backstage/core-plugin-api';
import {ArgoResponse} from "../../dev";

export interface ArgocdAutopilotApi {
    PostArgoApi(action: string, manType: string, checkedItems: any): Promise<ArgoResponse>;
}

export const argocdAutopilotApiRef = createApiRef<ArgocdAutopilotApi>({
    id: 'plugin.argocd-autopilot.service',
});