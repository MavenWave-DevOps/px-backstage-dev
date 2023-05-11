import { Git } from "@backstage/backend-common";
import * as azdev from "azure-devops-node-api";
import * as GitApi from "azure-devops-node-api/GitApi";
import * as GitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { DiscoveryApi } from '@backstage/core-plugin-api';
import { HttpOptions } from './types';

import { Logger } from "winston";
class HttpError extends Error {}
const DEFAULT_TIMEOUT = 60_000;

export const generateBackstageUrl = (
  discovery: DiscoveryApi,
  path: string,
): Promise<string> => discovery.getBaseUrl(path.startsWith('/') ? path.substring(1) : path);

export const http = async (
  options: HttpOptions,
  logger: Logger,
): Promise<any> => {
  let res: any;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  const { url, ...other } = options;
  const httpOptions = { ...other, signal: controller.signal };

  try {
    res = await fetch(url, httpOptions);
    if (!res) {
      throw new HttpError(
        `Request was aborted as it took longer than ${
          DEFAULT_TIMEOUT / 1000
        } seconds`,
      );
    }
  } catch (e) {
    throw new HttpError(`There was an issue with the request: ${e}`);
  }

  clearTimeout(timeoutId);

  const headers: any = {};
  for (const [name, value] of res.headers) {
    headers[name] = value;
  }

  const isJSON = () =>
    headers['content-type'] &&
    headers['content-type'].includes('application/json');

  let body;
  try {
    body = isJSON() ? await res.json() : { message: await res.text() };
  } catch (e) {
    throw new HttpError(`Could not get response: ${e}`);
  }

   if (res.status >= 400) {
    logger.error(
      `There was an issue with your request. Status code: ${
        res.status
      } Response body: ${JSON.stringify(body)}`,
    );
    throw new HttpError('Unable to complete request');
  }
  return { code: res.status, headers, body };
};

export const getObjFieldCaseInsensitively = (obj = {}, fieldName: string) => {
  const [, value = ''] =
    Object.entries<string>(obj).find(
      ([key]) => key.toLowerCase() === fieldName.toLowerCase(),
    ) || [];

  return value;
};

export async function cloneRepo({
  dir,
  auth,
  logger,
  remote = "origin",
  remoteUrl,
  branch = "main",
}: {
  dir: string;
  auth: { username: string; password: string } | { token: string };
  logger: Logger;
  remote?: string;
  remoteUrl: string;
  branch?: string;
}): Promise<void> {
  const git = Git.fromAuth({
    ...auth,
    logger,
  });

  await git.clone({
    url: remoteUrl,
    dir,
  });

  await git.addRemote({
    dir,
    remote,
    url: remoteUrl,
  });

  await git.checkout({
    dir,
    ref: branch,
  });
}

export async function commitPush({
  dir,
  auth,
  logger,
  remote = "origin",
  commitMessage,
  gitAuthorInfo,
  branch = "main",
}: {
  dir: string;
  auth: { username: string; password: string } | { token: string };
  logger: Logger;
  remote?: string;
  commitMessage: string;
  gitAuthorInfo?: { name?: string; email?: string };
  branch?: string;
}): Promise<void> {
  const git = Git.fromAuth({
    ...auth,
    logger,
  });

  await git.checkout({
    dir,
    ref: branch,
  });

  await git.add({
    dir,
    filepath: ".",
  });

  //  fallbacks Action
  const authorInfo = {
    name: gitAuthorInfo?.name ?? "Scaffolder",
    email: gitAuthorInfo?.email ?? "scaffolder@backstage.io",
  };

  await git.commit({
    dir,
    message: commitMessage,
    author: authorInfo,
    committer: authorInfo,
  });

  await git.push({
    dir,
    remote: remote,
    remoteRef: `refs/heads/${branch}`,
  });
}

export async function createADOPullRequest({
    gitPullRequestToCreate,
    auth,
    repoId,
    project,
    supportsIterations,
}:{
    gitPullRequestToCreate: GitInterfaces.GitPullRequest;
    auth: { org: string; token: string };
    repoId: string;
    project?: string;
    supportsIterations?: boolean;
}): Promise<void> {
    const url = "https://dev.azure.com/";
    const orgUrl = url + auth.org;
    const token: string = auth.token; // process.env.AZURE_TOKEN || "";
    const authHandler = azdev.getPersonalAccessTokenHandler(token);
    const connection = new azdev.WebApi(orgUrl, authHandler);

    const gitApiObject: GitApi.IGitApi = await connection.getGitApi();

    await gitApiObject.createPullRequest( gitPullRequestToCreate, repoId, project, supportsIterations );
}
