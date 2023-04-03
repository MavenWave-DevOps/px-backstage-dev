import { useEffect, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { myPluginApiRef } from '../api/types';

export const useMyPluginObjects = () => {
  const [ loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const myPluginApi = useApi(myPluginApiRef);
  const getObjects = async () => {
    try {
      const health = await myPluginApi.getHealth();
      setStatus(health.status);
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

