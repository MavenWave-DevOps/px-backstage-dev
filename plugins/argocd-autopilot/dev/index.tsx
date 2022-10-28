import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { createDevApp } from '@backstage/dev-utils';
import { TestApiProvider } from '@backstage/test-utils';
import { argocdAutopilotPlugin, EntityArgocdAutopilotContent } from '../src/plugin';
import { ArgocdAutopilotApi, argocdAutopilotApiRef} from "../src";
import axios from 'axios';

const mockEntity: Entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
        name: 'backstage',
        description: 'backstage.io',
        annotations: {
            'backstage.io/kubernetes-id': 'dice-roller',
        },
    },
    spec: {
        lifecycle: 'production',
        type: 'service',
        owner: 'user:guest',
    },
};
type ArgoResponse = {
    Status: number,
    Message: Array<string>,
}
class MockPluginClient implements ArgocdAutopilotApi {

    async PostArgoApi(): Promise<{ status: string; }> {
        try {
            const { data } = await axios.post<ArgoResponse>(
                'http://localhost:8080/run',
                {
                    'git-repo': 'https://github.com/tony-mw/autotest-argo-demo.git',
                    'git-token-path': '/Users/tonyprestifilippo/.github_token',
                    'root-command': 'argocd-autopilot',
                    'args': ['repo', 'bootstrap']
                },
                {
                    headers: {'Content-Type': 'application/json'},
                    Accept: 'application/json',
                },
            );
            console.log(JSON.stringify(data, null, 4))
            // let obj = JSON.parse(data)
            return { status: JSON.stringify(data, null, 4)};
        } catch(error) {
            if (axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
                // 👇️ error: AxiosError<any, any>
                return error.message;
            } else {
                console.log('unexpected error: ', error);
                return {status: 'An unexpected error occurred'};
            }
        }
    }
}

createDevApp()
  .registerPlugin(argocdAutopilotPlugin)
  .addPage({
    path: '/fixture-1',
    title: 'Fixture 1',
    element: (
        <TestApiProvider
            apis={[[argocdAutopilotApiRef, new MockPluginClient()]]}
        >
            <EntityProvider entity={mockEntity}>
              <EntityArgocdAutopilotContent />,
            </EntityProvider>
        </TestApiProvider>
    ),
  })
  .render();
