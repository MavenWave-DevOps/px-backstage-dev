import React, {useCallback, useState} from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import {useMyPluginObjects} from "../../hooks/useMyPluginObjects";
import Button from "./CustomButtonComponent";

export const ExampleComponent = () => {
    const { entity } = useEntity();
    const { error, loading, status } = useMyPluginObjects();
    if (loading) {
        return <div>Loading</div>;
    }
    if (error) {
        return <div>Error</div>;
    }
    return (<>
        <div>Hello {entity.metadata.name}</div>
        <div>Status: {status}</div>
    </>);
    // const { entity } = useEntity();
    // const [isSending, setIsSending] = useState(false)
    // const sendRequest = useCallback(async () => {
    //     // don't send again while we are sending
    //     if (isSending) return
    //     // update state
    //     setIsSending(true)
    //     // send the actual request
    //     const { error, loading, status } = useMyPluginObjects()
    //     // once the request is sent, update state again
    //     setIsSending(false)
    // }, [isSending]) // update the callback if the state changes
    //
    // return (<>
    //     <div>Hello {entity.metadata.name}</div>
    //     <div>
    //         <input type="button" disabled={isSending} onClick={sendRequest} />
    //     </div>
    //     <div>Status: {status}</div>
    //     </>)
}