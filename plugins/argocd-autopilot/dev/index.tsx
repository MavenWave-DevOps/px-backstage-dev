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

    async PostArgoApi(action: string, manType: string): Promise<{ status: string; }> {

        console.log(action)
        const tokenPath=".github_token"
        const command="argocd-autopilot"

        const repoName=document.getElementById('repo-name') as HTMLInputElement
        const repoOrg = document.getElementById('git-repo-org') as HTMLInputElement
        // https://github.com/tony-mw/autotest-argo.git example
        const repo = "https://github.com/"+repoOrg.value+"/"+repoName.value+".git"

        var argsArray: Array<string> = []
        if (action === "bootstrap") {
            var staticArray = ["repo", "bootstrap"]
            var args=document.getElementById('extra-args') as HTMLInputElement
            console.log("Extra args: "+args)
            var extraArgs = args.value.split(",")
            argsArray = staticArray.concat(extraArgs)

        } else if (action === "app-add") {
            var appName = document.getElementById('app-name') as HTMLInputElement
            var appRepo = document.getElementById('app-repo') as HTMLInputElement
            var project = document.getElementById('project') as HTMLInputElement
            //var manifestType = document.getElementById('man-type') as HTMLInputElement
            argsArray = ["app", "create", appName.value, "--app="+appRepo.value, "--project="+project.value, "--type="+manType]
        } else if (action === "project-add") {
            var projectName = document.getElementById('new-project') as HTMLInputElement
            argsArray = ["project", "create", projectName.value]
        } else if (action === "test") {
            argsArray = ["--help"]
        } else {
            console.log(action)
            return {status: 'Form is invalid'}
        }

        let trimmedArgsArr = argsArray.map(s=>s.trim())
        console.log(trimmedArgsArr)
        console.log(repo)
        try {
            const d = {
                    //'https://github.com/tony-mw/autotest-argo-demo.git'
                    'git-repo': repo,
                    'git-token-path': tokenPath,
                    'root-command': command,
                    'args': trimmedArgsArr
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
