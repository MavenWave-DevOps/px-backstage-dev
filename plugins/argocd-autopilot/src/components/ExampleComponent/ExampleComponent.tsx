import React, {useEffect, useState} from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
// import Button from "./CustomButtonComponent";
import {useApi} from "@backstage/core-plugin-api";
import {argocdAutopilotApiRef} from "../../api";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import Typography, {AppBar} from "@material-ui/core";


export const ExampleComponent = () => {
    const { entity } = useEntity();
    const [loading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('N/A');
    const [error, setError] = useState<boolean>(false);
    const myPluginApi = useApi(argocdAutopilotApiRef);

    async function getObjects() {
        try {
            if(!loading) {
                setLoading(true)
            }
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
    // if (loading) {
    //     setStatus("loading")
    // }
    return (<>
        <h1>
            ArgoCD Autopilot {entity.metadata.name} Plugin
        </h1>
        <form>
        <Grid container alignItems="flex-start" direction="column">
            <Grid item>
                <FormControl>
                    <TextField
                        id="git-repo"
                        name="Git Repo"
                        label="git-repo"
                        type="text"
                        // value={formValues.age}
                        // onChange={handleInputChange}
                        />
                    <TextField
                        id="git-token-path"
                        name="Git Token Path"
                        label="git-token-path"
                        type="text"
                        // value={formValues.age}
                        // onChange={handleInputChange}
                    />
                    <TextField
                        id="root-command"
                        name="Command"
                        label="root-command"
                        type="text"
                        // value={formValues.age}
                        // onChange={handleInputChange}
                    />
                    <TextField
                        id="args"
                        name="Arguments"
                        label="args"
                        type="text"
                        // value={formValues.age}
                        // onChange={handleInputChange}
                    />
                    </FormControl>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={getObjects}>{loading ? <>Loading..</> : <>Submit</>}</Button>
                </Grid>
                </Grid>
            </form>
        <div>
            <h3>Status: {status}</h3>
        </div>
    </>);
}