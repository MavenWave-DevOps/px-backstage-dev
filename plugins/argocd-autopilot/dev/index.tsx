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
        const repo=document.getElementById('git-repo') as HTMLInputElement
        const tokenPath=document.getElementById('git-token-path') as HTMLInputElement
        const command=document.getElementById('root-command') as HTMLInputElement
        const args=document.getElementById('args') as HTMLInputElement
        const argsSplit = args.value.split(",")
        try {
            const d = {
                    //'https://github.com/tony-mw/autotest-argo-demo.git'
                    'git-repo': repo.value,
                    'git-token-path': tokenPath.value,
                    'root-command': command.value,
                    'args': argsSplit
                }
            console.log(d)
            const { data } = await axios.post<ArgoResponse>(
                'http://localhost:8080/run',
                d,
                {
                    headers: {'Content-Type': 'application/json'},
                },
            );
           //let obj = JSON.parse(data)
            return { status: data.message};
        } catch(error) {
            if (axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
                // 👇️ error: AxiosError<any, any>
                return {status: error.message};
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
