import TextField from "@material-ui/core/TextField";
import React from "react";
import {FormControl, Grid} from "@mui/material";

const Bootstrap = () => {
    return (
        <Grid item>
            <FormControl fullWidth>
                <TextField
                    fullWidth
                    id="extra-args"
                    name="args"
                    label="Extra Args"
                    type="text"
                />
            </FormControl>
        </Grid>
    )
}

export default Bootstrap;