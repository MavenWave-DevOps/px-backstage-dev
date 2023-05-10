import { Config } from "@backstage/config";
import {ScmIntegrationRegistry} from "@backstage/integration";
import { createTemplateAction } from "@backstage/plugin-scaffolder-node";
import {getRepoSourceDirectory} from "../utils";
import {InputError} from "@backstage/errors";
import {commitAndPushBranch} from "../helpers";

export const commitAndPushADOBranch = (options: {
    integrations: ScmIntegrationRegistry;
    config: Config;
}) => {
    const { integrations, config } = options;

    return createTemplateAction<{
        branch?: string;
        sourcePath?: string;
        gitCommitMessage?: string;
        gitAuthorName?: string;
        gitAuthorEmail?: string;
        token?: string;
    }>({
        id: "ado:repo:push",
        description: "Push the content in the workspace to ADO repo.",
        schema: {
            input: {
                required: [],
                type: "object",
                properties: {
                    input: {
                        type: 'object',
                        required: [],
                        properties: {
                            branch: {
                                title: "Repository Branch",
                                type: "string",
                                description: "The branch to checkout to.",
                            },
                            sourcePath: {
                                type: "string",
                                title: "Working Subdirectory",
                                description:
                                    "The subdirectory of the working directory containing the repository.",
                            },
                            gitCommitMessage: {
                                title: "Git Commit Message",
                                type: "string",
                                description:
                                    "Sets the commit message on the repository. The default value is 'Initial commit'",
                            },
                            gitAuthorName: {
                                title: "Default Author Name",
                                type: "string",
                                description:
                                    "Sets the default author name for the commit. The default value is 'Scaffolder'.",
                            },
                            gitAuthorEmail: {
                                title: "Default Author Email",
                                type: "string",
                                description: "Sets the default author email for the commit.",
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
            const { branch, gitCommitMessage, gitAuthorName, gitAuthorEmail } = ctx.input;

            const sourcePath = getRepoSourceDirectory(
                ctx.workspacePath,
                ctx.input.sourcePath
            );

            const host = "dev.azure.com";
            const integrationConfig = integrations.azure.byHost(host);

            if (!integrationConfig) {
                throw new InputError(
                    `No matching integration configuration for host ${host}, please check your integrations config`
                );
            }

            if (!integrationConfig.config.token && !ctx.input.token) {
                throw new InputError(`No token provided fro Azure Integration ${host}`);
            }

            if (ctx.input.branch === "main") {
                throw new InputError(`Main branch is illegal to push to`);
            }

            const token = ctx.input.token ?? integrationConfig.config.token!;

            const gitAuthorInfo = {
                name: gitAuthorName ? gitAuthorName : config.getOptionalString("scaffolder.defaultAuthor.name"),
                email: gitAuthorEmail ? gitAuthorEmail : config.getOptionalString("scaffolder.defaultAuthor.email"),
            }

            await commitAndPushBranch({
                dir: sourcePath,
                auth: { username: "notempty", password: token },
                logger: ctx.logger,
                commitMessage: gitCommitMessage
                    ? gitCommitMessage : config.getOptionalString("scaffolder.defaultCommitMessage") || "Init",
                gitAuthorInfo,
                branch,
            });
        },
    });
};