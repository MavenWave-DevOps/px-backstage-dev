import TextField from "@material-ui/core/TextField";
import React from "react";
import {FormControl, Grid} from "@mui/material";

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
            </FormControl>
        </Grid>
    )
}

export default AddApp;