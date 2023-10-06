
import { useEffect, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { argocdAutopilotApiRef } from '../api/types';

export const useMyPluginObjects = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const myPluginApi = useApi(argocdAutopilotApiRef);
    const getObjects = async () => {
        try {
            const resp = await myPluginApi.PostArgoApi("","","");
            setStatus(resp.message);
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getObjects();
    });
    return {
      error,
      loading,
      status,
    }
}
