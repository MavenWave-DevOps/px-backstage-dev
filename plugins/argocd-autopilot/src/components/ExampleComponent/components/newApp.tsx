import TextField from "@material-ui/core/TextField";
import React from "react";
import {FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup} from "@mui/material";

const AddApp = () => {
    return (
        <Grid item>
            <FormControl fullWidth>
                <TextField
                    fullWidth
                    id="app-name"
                    name="app-name"
                    label="App Name"
                    type="text"
                />
                <TextField
                    fullWidth
                    id="app-repo"
                    name="app-repo"
                    label="App Repo"
                    type="text"
                />
                <TextField
                    fullWidth
                    id="project"
                    name="project"
                    label="Project"
                    type="text"
                />
                <FormLabel id="manifest-type">Manifest Type</FormLabel>
                <RadioGroup
                    id="manifest-type"
                    aria-labelledby="manifest-type"
                    defaultValue="kustomize"
                    name="manifest-type-group"
                >
                    <FormControlLabel value="kustomize" control={<Radio />} label="kustomize" />
                    <FormControlLabel value="helm" control={<Radio />} label="helm" />
                    <FormControlLabel value="other" control={<Radio />} label="other" />
                </RadioGroup>
            </FormControl>
        </Grid>
    )
}

export default AddApp;