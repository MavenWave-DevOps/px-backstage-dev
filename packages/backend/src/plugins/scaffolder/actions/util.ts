import { isChildPath } from "@backstage/backend-common";

import { join as joinPath, normalize as normalizePath } from "path";

export const getRepoSourceDirectory = (
  workspacePath: string,
  sourcePath: string | undefined
) => {
  if (sourcePath) {
    const safeSuffix = normalizePath(sourcePath).replace(
      /^(\.\.(\/|\\|$))+/,
      ""
    );
    const path = joinPath(workspacePath, safeSuffix);
    if (!isChildPath(workspacePath, path)) {
      throw new Error("Invalid source path");
    }
    return path;
  }
  return workspacePath;
};
