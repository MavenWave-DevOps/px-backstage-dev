import { createApiRef } from "@backstage/core-plugin-api";

export interface gcpcostApi {
  getHealth(): Promise<{ status: string }>;
  getResponseData(): Promise<{ responsedata: {} }>
}

export const gcpcostApiRef = createApiRef<gcpcostApi>({
  id: 'plugin.bigqueryapi.service'
})
