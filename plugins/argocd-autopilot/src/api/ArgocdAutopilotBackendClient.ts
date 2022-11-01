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

    async PostArgoApi(): Promise<{ status: string; }> {
        const unneededurlithink = `${await this.discoveryApi.getBaseUrl('argocd-autopilot')}/run`;
        console.log(unneededurlithink)

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
            //return await this.handleResponse(data);
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