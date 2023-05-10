import {ScmIntegrationRegistry} from "@backstage/integration";
import { createTemplateAction } from "@backstage/plugin-scaffolder-node";
import {InputError} from "@backstage/errors";
import { createADOPullRequest} from "../helpers";
import * as GitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
// import {getRepoSourceDirectory} from "../utils";
// import {resolveSafeChildPath} from "@backstage/backend-common";

export const createAzurePullRequest = (options: {
    integrations: ScmIntegrationRegistry;
}) => {
    const { integrations } = options;

    return createTemplateAction<{
        // remoteUrl: string;
        sourcePath?: string;
        targetPath?: string;
        title: string;
        repoId: string;
        project?: string;
        supportsIterations?: boolean;
        token?: string;
    }>({
        id: "ado:repo:pr",
        description: "Create a PR to the gitops repository in ADO.",
        schema: {
            input: {
                required: [],
                type: "object",
                properties: {
                    input: {
                        type: 'object',
                        required: ['repoId', 'remoteUrl', 'title'],
                        properties: {
                            // remoteUrl: {
                            //     title: 'Remote GitOps Repository',
                            //     description: 'The Git URL to the repo for PR.',
                            //     type: 'string',
                            // },
                            sourcePath: {
                                type: "string",
                                title: "Working Subdirectory",
                                description:
                                    "The subdirectory of the working directory containing the repository.",
                            },
                            targetPath: {
                                title: 'Working Subdirectory',
                                type: 'string',
                                description: 'The subdirectory of workspace to clone the repo into.',
                            },
                            repoId: {
                                title: 'Remote Repo ID',
                                description: 'Repo ID of the pull request.',
                                type: 'string',
                            },
                            title: {
                                title: 'Title',
                                description: 'The title of the pull request.',
                                type: 'string',
                            },
                            project: {
                                title: 'ADO Project',
                                description: 'The Project in Azure DevOps.',
                                type: 'string',
                            },
                            supportsIterations: {
                                title: 'Supports Iterations',
                                description: 'Whether or not the PR supports interations.',
                                type: 'boolean',
                            },
                            token: {
                                title: "Authenticatino Token",
                                type: "string",
                                description: "The token to use for authorization.",
                            },
                        }
                    },
                },
            },
        },
        async handler(ctx) {
            const { title, repoId, project, supportsIterations } = ctx.input;

            const sourcePath = `refs/heads/${ctx.input.sourcePath}` ?? "backstage-test";
            const targetPath = `refs/heads/${ctx.input.targetPath}` ?? "main";

            console.log("sourcePath: ", sourcePath);
            console.log("targetPath: ", targetPath);

            const host = "dev.azure.com";
            const integrationConfig = integrations.azure.byHost(host);

            if (!integrationConfig) {
                throw new InputError(
                    `No matching integration configuration for host ${host}, please check your integrations config`
                );
            }

            if (!integrationConfig.config.token && !ctx.input.token) {
                throw new InputError(`No token provided for Azure Integration ${host}`);
            }

            const pullRequest: GitInterfaces.GitPullRequest = {
                sourceRefName: sourcePath,
                targetRefName: targetPath,
                // remoteUrl: remoteUrl,
                title: title,
            } as GitInterfaces.GitPullRequest;

            const org = "foster-devops";
            const token = ctx.input.token ?? integrationConfig.config.token!;

            await createADOPullRequest({
                gitPullRequestToCreate: pullRequest,
                auth: { org, token },
                repoId: repoId,
                project: project,
                supportsIterations: supportsIterations,
            });
        },
    });
};
