import { ArgocdAutopilotApi } from './types';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import axios from "axios";

type ArgoResponse = {
    message: string,
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

    async PostArgoApi(action: string, manType: string): Promise<{ status: string; }> {
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