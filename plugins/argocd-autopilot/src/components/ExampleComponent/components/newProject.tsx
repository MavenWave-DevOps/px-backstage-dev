import TextField from "@material-ui/core/TextField";
import React from "react";
import {FormControl, Grid} from "@mui/material";

const NewProject = () => {
    return (
        <Grid item>
            <FormControl fullWidth>
                <TextField
                    fullWidth
                    id="new-project"
                    name="new-project"
                    label="New Project Name"
                    type="text"
                />
            </FormControl>
        </Grid>
    )
}

export default NewProject;