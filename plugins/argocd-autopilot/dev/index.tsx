import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { createDevApp } from '@backstage/dev-utils';
import { TestApiProvider } from '@backstage/test-utils';
import { argocdAutopilotPlugin, EntityArgocdAutopilotContent } from '../src/plugin';
import { ArgocdAutopilotApi, argocdAutopilotApiRef } from "../src";
// import * as fs from 'fs';
// import * as stream from 'stream';
import axios from 'axios';
// import { promisify } from 'util';

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
export type ArgoResponse = {
    link: string,
    message: string,
    logs: Array<string>
}

class MockPluginClient implements ArgocdAutopilotApi {

    buildCommand(action: string,  manType: string, checkedItems: any): Array<Array<string>> {
        let baseCommand: string = ""
        if (action === "bootstrap" || action === "uninstall") {
            let extraArgs=document.getElementById('extra-args') as HTMLInputElement
            let commandArr: Array<string> = []
            baseCommand = "repo"
            commandArr = [baseCommand, action]
            let splitArgs = extraArgs.value.split(",")
            return [commandArr.concat(splitArgs)]
        }  else if  (action === "app-create" || action === "app-delete") {
            let appName = document.getElementById('app-name') as HTMLInputElement

            let appRepo: HTMLInputElement
            let project = document.getElementById('project') as HTMLInputElement
            //var manifestType = document.getElementById('man-type') as HTMLInputElement
            baseCommand = action.split("-")[1]
            if (action === "app-create") {
                appRepo = document.getElementById('app-repo') as HTMLInputElement
                return [["app", baseCommand, appName.value, "--app="+appRepo.value, "--project="+project.value, "--type="+manType, "--labels=backstage=enabled"]]
            } else {
                return [["app", baseCommand, appName.value, "--project="+project.value]]
            }
        } else if (action === "project-create" || action === "project-delete") {
            console.log("Matched condition: ", action)
            let projectName = document.getElementById('new-project') as HTMLInputElement
            baseCommand = action.split("-")[1]
            return [["project", baseCommand, projectName.value]]
        } else if (action === "manage-addons" ) {
            let returnCommands: Array<Array<string>> = []
            let project = document.getElementById('addon-project') as HTMLInputElement
            let addons = new Map<string,string>([
                ["cert-manager", "github.com/MavenWave-DevOps/tidalwave-cert-manager/cert-manager"],
                ["crossplane", "github.com/MavenWave-DevOps/tidalwave-crossplane/crossplane"],
                ["crossplane-provider-configs", "github.com/MavenWave-DevOps/tidalwave-crossplane/provider-configs"],
                ["external-secrets", "github.com/MavenWave-DevOps/tidalwave-external-secrets/external-secrets"],
                ["external-dns", "github.com/MavenWave-DevOps/tidalwave-external-dns/external-dns-google"],
                ["nginx-ingress", "github.com/MavenWave-DevOps/tidalwave-ingress-nginx/ingress-nginx-nodeport"],
                ["istio", "github.com/MavenWave-DevOps/tidalwave-istio/istiod"],
                ["istio-ingress", "github.com/MavenWave-DevOps/tidalwave-istio/istio-ingress-clusterip"],
                ["opa-gatekeeper", "github.com/MavenWave-DevOps/tidalwave-opa-gatekeeper/opa-gatekeeper"]
            ])
            console.log("addons: ", addons)
            console.log("Map size: ", checkedItems.size)
            for (const [key, value] of addons) {
                console.log(key, value);
                //console.log(checkedItems)
                //console.log("In loop", checkedItems["cert-manager"])
                if (key in checkedItems) {
                    console.log("Key found: ", true)
                    let args = ["app", "create", key, "--app="+value, "--project="+project.value, "--type="+manType, "--labels=backstage=enabled"]
                    console.log("Args are: ", args)
                    returnCommands.push(args)
                    console.log("Commands are: ", returnCommands)
                }
                // if (checkedItems[key]) {
                //     console.log(key, "IsChecked")
                //     let args = ["app", "create", key, "--app="+value, "--project="+project.value, "--type="+manType, "--labels=backstage=enabled"]
                //     console.log(args)
                //     returnCommands.push(args)
                //     console.log("Commands are: ", returnCommands)
                // }
            };
            return returnCommands

        } else if (action === "test") {
            return [["--help"]]
        } else {
            console.log("Didn't match a condition: ", action)
        }
        return [['Form is invalid']]
    }

    async PostArgoApi(action: string, manType: string, checkedItems: any): Promise<ArgoResponse> {
        console.log(action)
        console.log("Checked Items are: ", checkedItems)
        const tokenPath=".github_token"
        const command="argocd-autopilot"

        const repoName=document.getElementById('repo-name') as HTMLInputElement
        const repoOrg = document.getElementById('git-repo-org') as HTMLInputElement
        // https://github.com/tony-mw/autotest-argo.git example
        const repo = "https://github.com/"+repoOrg.value+"/"+repoName.value+".git"

        let argsArray = this.buildCommand(action, manType, checkedItems)
        let returnMessage: ArgoResponse = {
            message: "",
            logs: []
        }

        for (let j=0; j<argsArray.length; j++) {
            let trimmedArgsArr = argsArray[j].map(s => s.trim())

            console.log(trimmedArgsArr)
            console.log(repo)

            let formattedResponse: Array<string> = []
            let logArr: Array<string> = []

            try {
                axios.defaults.adapter = require('axios/lib/adapters/http')


                const d = {
                    //'https://github.com/tony-mw/autotest-argo-demo.git'
                    'git-repo': repo,
                    'git-token-path': tokenPath,
                    'root-command': command,
                    'args': trimmedArgsArr
                }
                console.log(d)
                const {data} = await axios.post<string>(
                    'http://localhost:8080/run',
                    d,
                    {
                        headers: {'Content-Type': 'application/json'},
                    },
                )
                formattedResponse = data.split("\n")
                console.log(typeof formattedResponse)
                for (let i = 1; i < formattedResponse.length; i++) {
                    logArr.push(JSON.parse(formattedResponse[i])["logMessage"])
                }
                returnMessage = {
                    message: JSON.parse(formattedResponse[0])["message"],
                    logs: logArr
                }
                console.log(returnMessage.logs)
                //return { status: returnMessage.message};
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                    // 👇️ error: AxiosError<any, any>
                    returnMessage = {
                        message: error.message,
                        logs: logArr
                    }
                    return returnMessage;
                } else {
                    console.log('unexpected error: ', error);
                    returnMessage = {
                        message: "An unexpected error occurred",
                        logs: logArr
                    }
                    return returnMessage;
                }
            }
        }
        return returnMessage
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
              <EntityArgocdAutopilotContent />
            </EntityProvider>
        </TestApiProvider>
    ),
  })
  .render();
