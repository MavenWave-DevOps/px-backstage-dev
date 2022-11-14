import React, {useEffect, useState} from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
// import Button from "./CustomButtonComponent";
import {useApi} from "@backstage/core-plugin-api";
import {argocdAutopilotApiRef} from "../../api";
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
import {Checkbox, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import RemoveApp from "./components/removeApp";

export const ExampleComponent = () => {
    const { entity } = useEntity();
    const [loading, setLoading] = useState<boolean>(false);
    const [triggered, setTriggered] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('');
    const [logs, setLogs] = useState<Array<string>>([]);
    const [link, setLink] = useState<string>('https://localhost:8083');
    const [error, setError] = useState<boolean>(false);
    const [action, setAction] = React.useState('');
    const [addonAction, setAddonAction] = React.useState('');
    const [bootstrapFormVisible, setBootstrapFormVisible] = useState(false);
    const [newAppFormVisible, setnewAppFormVisible] = useState(false);
    const [addonFormVisible, setAddonFormVisible] = useState(false)
    const [removeAppFormVisible, setremoveAppFormVisible] = useState(false);
    const [newProjectFormVisible, setnewProjectFormVisible] = useState(false);
    const [manType, setManifestType] = React.useState('kustomize');
    const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        action === 'bootstrap' || action === 'uninstall' ? setBootstrapFormVisible(true): setBootstrapFormVisible(false)
        action === 'app-create' ? setnewAppFormVisible(true): setnewAppFormVisible(false)
        action === 'app-delete' ? setremoveAppFormVisible(true): setremoveAppFormVisible(false)
        action === 'project-create' || action === 'project-delete'? setnewProjectFormVisible(true): setnewProjectFormVisible(false)
        action === 'manage-addons' ? setAddonFormVisible(true) : setAddonFormVisible(false)
    },[action])

    useEffect(() => {
        console.log("checkedItems: ", checkedItems);
    }, [checkedItems]);

    const myPluginApi = useApi(argocdAutopilotApiRef);

    const handleManifestChange = (event: SelectChangeEvent) => {
        setManifestType(event.target.value as string);
    };

    const handleAddonChange = (event: SelectChangeEvent) => {
        setAddonAction(event.target.value as string);
    };

    const handleChange = (event: SelectChangeEvent) => {
        setAction(event.target.value as string);
    };

    const handleChecked = (event) => {
        // updating an object instead of a Map
        setCheckedItems({...checkedItems, [event.target.name] : event.target.checked });
    }

    const checkboxes = [
        {
            name:  'cert-manager',
            key:   'cert-manager',
            label: 'cert-manager',
        },
        {
            name:  'crossplane',
            key:   'crossplane',
            label: 'crossplane',
        },
        {
            name:  'crossplane-provider-configs',
            key:   'crossplane-provider-configs',
            label: 'crossplane-provider-configs',
        },
        {
            name:  'external-secrets',
            key:   'external-secrets',
            label: 'external-secrets',
        },
        {
            name:  'external-dns',
            key:   'external-dns',
            label: 'external-dns',
        },
        {
            name:  'nginx-ingress',
            key:   'nginx-ingress',
            label: 'nginx-ingress',
        },
        {
            name:  'istio',
            key:   'istio',
            label: 'istio',
        },
        {
            name:  'istio-ingress',
            key:   'istio-ingress',
            label: 'istio-ingress',
        },
        {
            name:  'opa-gatekeeper',
            key:   'opa-gatekeeper',
            label: 'opa-gatekeeper',
        },

    ];

    async function getObjects() {
        try {
            if(!loading) {
                setLoading(true)
            }
            const resp = await myPluginApi.PostArgoApi(action, manType, checkedItems);
            setTriggered(true)
            console.log("Returned link: ", resp.link)
            console.log("Returned message: ", resp.message)
            setStatus(resp.message);
            setLogs(resp.logs)
            setLink(resp.link)
        } catch (e) {
            setError(true);
            console.log(error)
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
                    <MenuItem value={'manage-addons'}>Manage Addons</MenuItem>
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
                {addonFormVisible &&
                    <>
                        <p><br /></p>
                        <InputLabel id="argo-addon-selection">Addon Action</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="select-action"
                            value={addonAction}
                            label="addonAction"
                            onChange={handleAddonChange}
                        >
                            <MenuItem value={'install-addons'}>Install</MenuItem>
                            <MenuItem value={'delete-addons'}>Delete</MenuItem>
                        </Select>
                        <p><br /></p>
                        <TextField
                            fullWidth
                            id="addon-project"
                            name="addon-project"
                            label="Project Name"
                            type="text"
                        />
                        <FormLabel color="info" sx={{ p:1 }} id="addons">Addon Selection</FormLabel>
                        {
                            checkboxes.map(item => (
                                <label key={item.key}>
                                    {item.name}
                                    <Checkbox name={item.name} checked={checkedItems[item.name]} onChange={handleChecked} />
                                </label>
                            ))
                        }
                    </>
                }
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
                {removeAppFormVisible && <RemoveApp />}
                {newProjectFormVisible && <NewProject />}

                </FormControl>
            <Box sx={{ p: 2 }}>
                <Button variant="contained" color="primary" onClick={getObjects}>{loading ? <>Loading..</> : <>Submit</>}</Button>
            </Box>
            </form>
        <div>
            <h3>Status: {loading ? <></> : status}</h3>
            {triggered ? <h3><a href={link}>ArgoCD UI Link</a></h3> : <></> }
            <h3>Logs:</h3>
            {triggered ? <></> : logs.map((log) => (
                            <>
                                <p>{log}<br /></p>
                                {/*<hr />*/}
                            </>
            ))}
        </div>
    </>);
}