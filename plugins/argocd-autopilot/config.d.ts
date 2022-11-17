export interface Config {
    /** Optional configurations for the ArgoCD plugin */
    argocdAutopilot: {
        /**
         * The base url of the ArgoCD instance.
         * @visibility frontend
         */
        apiUrl: string;
        /**
         * The base url of the ArgoCD instance.
         * @visibility frontend
         */
    };
}