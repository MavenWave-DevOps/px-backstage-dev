import React, {useEffect, useState} from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import {useMyPluginObjects} from "../../hooks/useMyPluginObjects";
import Button from "./CustomButtonComponent";
import {useApi} from "@backstage/core-plugin-api";
import {argocdAutopilotApiRef} from "../../api";

export const ExampleComponent = () => {
    const { entity } = useEntity();
    const [loading, setLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<string>('N/A');
    const [error, setError] = useState<boolean>(false);
    const myPluginApi = useApi(argocdAutopilotApiRef);

    async function getObjects() {
        try {
            const resp = await myPluginApi.PostArgoApi();
            setStatus(resp.status);
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    // useEffect(() => {
    //     getObjects();
    // });

    return (<>
        <div>ArgoCD Autopilot {entity.metadata.name} Plugin</div>
        <button type="button" onClick={getObjects}>Trigger</button>
        <div>Status: {status}</div>
    </>);
}