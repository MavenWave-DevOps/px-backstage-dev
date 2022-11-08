import { ArgocdAutopilotApi } from './types';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import axios from "axios";

export type ArgoResponse = {
    message: string,
    logs: Array<string>
}

export class ArgocdAutopilotBackendClient implements ArgocdAutopilotApi {
   private readonly discoveryApi: DiscoveryApi;
    constructor(options: {
        discoveryApi: DiscoveryApi;
    }) {
        this.discoveryApi = options.discoveryApi;
    }
    // private async handleResponse(response: Response): Promise<any> {
    //     if (!response.ok) {
    //         throw new Error();
    //     }
    //     return await response.json();
    // }

    buildCommand(action: string,  manType: string): Array<string> {
        let baseCommand: string = ""
        if (action === "bootstrap" || action === "uninstall") {
            let extraArgs=document.getElementById('extra-args') as HTMLInputElement
            let commandArr: Array<string> = []
            baseCommand = "repo"
            commandArr = [baseCommand, action]
            let splitArgs = extraArgs.value.split(",")
            return commandArr.concat(splitArgs)
        }  else if  (action === "app-create" || action === "app-delete") {
            let appName = document.getElementById('app-name') as HTMLInputElement
            let appRepo = document.getElementById('app-repo') as HTMLInputElement
            let project = document.getElementById('project') as HTMLInputElement
            //var manifestType = document.getElementById('man-type') as HTMLInputElement
            baseCommand = action.split("-")[1]
            return ["app", baseCommand, appName.value, "--app="+appRepo.value, "--project="+project.value, "--type="+manType, "--labels=backstage=enabled"]
        } else if (action === "project-create" || action === "project-delete") {
            console.log("Matched condition: ", action)
            let projectName = document.getElementById('new-project') as HTMLInputElement
            baseCommand = action.split("-")[1]
            return ["project", baseCommand, projectName.value]
        } else if (action === "test") {
            return ["--help"]
        } else {
            console.log("Didn't match a condition: ", action)
        }
        return ['Form is invalid']
    }

    async PostArgoApi(action: string, manType: string): Promise<ArgoResponse> {
        const unneededurlithink = `${await this.discoveryApi.getBaseUrl('argocd-autopilot')}/run`;
        console.log(unneededurlithink)

        console.log(action)
        const tokenPath=".github_token"
        const command="argocd-autopilot"

        const repoName=document.getElementById('repo-name') as HTMLInputElement
        const repoOrg = document.getElementById('git-repo-org') as HTMLInputElement
        // https://github.com/tony-mw/autotest-argo.git example
        const repo = "https://github.com/"+repoOrg.value+"/"+repoName.value+".git"
        let argsArray = this.buildCommand(action, manType)
        let trimmedArgsArr = argsArray.map(s=>s.trim())

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
            const { data } = await axios.post<string>(
                'http://localhost:8080/run',
                d,
                {
                    headers: {'Content-Type': 'application/json'},
                },
            )
            formattedResponse = data.split("\n")
            console.log(typeof formattedResponse)
            console.log(formattedResponse)
            for (let i=1; i<formattedResponse.length; i++) {
                logArr.push(JSON.parse(formattedResponse[i])["logMessage"])
            }
            let returnMessage: ArgoResponse = {
                message: JSON.parse(formattedResponse[0])["message"],
                logs: logArr
            }
            console.log(returnMessage.logs)
            //return { status: returnMessage.message};
            return returnMessage
        } catch(error) {
            if (axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
                // 👇️ error: AxiosError<any, any>
                let returnMessage: ArgoResponse = {
                    message: error.message,
                    logs: logArr
                }
                return returnMessage;
            } else {
                console.log('unexpected error: ', error);
                let returnMessage: ArgoResponse = {
                    message: "An unexpected error occurred",
                    logs: logArr
                }
                return returnMessage;
            }
        }
    }
}