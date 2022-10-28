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
    message: string,
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
                    'args': ['repo', '--help']
                },
                {
                    headers: {'Content-Type': 'application/json'},
                },
            );
            console.log(typeof data)
           //let obj = JSON.parse(data)
            return { status: data.message};
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
    path: '/ArgocdAutopilot',
    title: 'ArgoCD Autopilot',
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
