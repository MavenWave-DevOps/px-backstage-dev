import TextField from "@material-ui/core/TextField";
import React from "react";
import {FormControl, Grid} from "@mui/material";

const RemoveApp = () => {
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
                    id="project"
                    name="project"
                    label="Project"
                    type="text"
                />
            </FormControl>
        </Grid>
    )
}

export default RemoveApp;