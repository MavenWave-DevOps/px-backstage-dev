import React, {useEffect, useState} from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
// import Button from "./CustomButtonComponent";
import {useApi} from "@backstage/core-plugin-api";
import {argocdAutopilotApiRef} from "../../api";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from '@mui/material/FormControl';
// import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { InputLabel} from "@material-ui/core";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Bootstrap from './components/bootstrap'
import AddApp from './components/newApp'
import NewProject from './components/newProject'
import {FormControlLabel, FormLabel, Radio, RadioGroup, TextareaAutosize} from "@mui/material";

export const ExampleComponent = () => {
    const { entity } = useEntity();
    const [loading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('N/A');
    const [logs, setLogs] = useState<Array<string>>(['N/A']);
    const [error, setError] = useState<boolean>(false);
    const [action, setAction] = React.useState('');
    const [bootstrapFormVisible, setBootstrapFormVisible] = useState(false);
    const [newAppFormVisible, setnewAppFormVisible] = useState(false);
    const [newProjectFormVisible, setnewProjectFormVisible] = useState(false);
    const [manType, setManifestType] = React.useState('kustomize');


    useEffect(() => {
        action === 'bootstrap' || action === 'uninstall' ? setBootstrapFormVisible(true): setBootstrapFormVisible(false)
        action === 'app-create' || action === 'app-delete' ? setnewAppFormVisible(true): setnewAppFormVisible(false)
        action === 'project-create' || action === 'project-delete'? setnewProjectFormVisible(true): setnewProjectFormVisible(false)
    },[action])

    const myPluginApi = useApi(argocdAutopilotApiRef);

    const handleManifestChange = (event: SelectChangeEvent) => {
        setManifestType(event.target.value as string);
    };

    const handleChange = (event: SelectChangeEvent) => {
        setAction(event.target.value as string);
    };

    async function getObjects() {
        try {
            if(!loading) {
                setLoading(true)
            }
            const resp = await myPluginApi.PostArgoApi(action, manType);
            setStatus(resp.message);
            setLogs(resp.logs)
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    return (<>
        <h1>
            {entity.metadata.name} plugin
        </h1>
        <Box>
            <FormControl fullWidth>
                <InputLabel id="argo-select-label">Action</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="select-action"
                    value={action}
                    label="action"
                    onChange={handleChange}
                >
                    <MenuItem value={'bootstrap'}>Bootstrap</MenuItem>
                    <MenuItem value={'uninstall'}>Uninstall Repo</MenuItem>
                    <MenuItem value={'app-create'}>Add App</MenuItem>
                    <MenuItem value={'app-delete'}>Delete App</MenuItem>
                    <MenuItem value={'project-create'}>Add Project</MenuItem>
                    <MenuItem value={'project-delete'}>Delete Project</MenuItem>
                    <MenuItem value={'test'}>Test</MenuItem>
                </Select>
            </FormControl>
        </Box>
        <form>
        {/*<Grid container alignItems="flex-start" direction="column">*/}
        {/*    <Grid item>*/}
            <FormControl fullWidth  sx={{ p:2 }}>
                <TextField
                    fullWidth
                    id="git-repo-org"
                    name="Git Repo Org"
                    label="Github Organization"
                    type="text"
                    // value={formValues.age}
                    // onChange={handleInputChange}
                    />
                <TextField
                    id="repo-name"
                    name="Repo Name"
                    label="Repo Name"
                    type="text"
                    // value={formValues.age}
                    // onChange={handleInputChange}
                />
                {newAppFormVisible &&
                    <><FormLabel color="info" sx={{ p:1 }} id="manifest-type">Manifest Type</FormLabel>
                        <RadioGroup
                        id="man-type"
                        value={manType}
                        aria-labelledby="manifest-type"
                        defaultValue="kustomize"
                        name="manifest-type-group"
                        onChange={handleManifestChange}
                    >
                        <FormControlLabel value="kustomize" control={<Radio/>} label="kustomize"/>
                        <FormControlLabel value="dir" control={<Radio/>} label="dir"/>
                    </RadioGroup></>
                }
                {bootstrapFormVisible && <Bootstrap />}
                {newAppFormVisible && <AddApp />}
                {newProjectFormVisible && <NewProject />}

                </FormControl>
            <Box sx={{ p: 2 }}>
                <Button variant="contained" color="primary" onClick={getObjects}>{loading ? <>Loading..</> : <>Submit</>}</Button>
            </Box>
            </form>
        <div>
            <h3>Status: {loading ? <></> : status}</h3>
            <h3>Logs:</h3>
            {loading ? <></> : logs.map((log) => (
                            <>
                                <p>{log}<br /></p>
                                {/*<hr />*/}
                            </>
            ))}
        </div>
    </>);
}