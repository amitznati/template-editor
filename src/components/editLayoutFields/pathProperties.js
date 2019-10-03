import React from 'react';
import {Grid, Typography, Button} from '@material-ui/core';

export default function PathProperties(props) {

    const {onTogglePathBuilder, pathData} = props;
    const path = pathData && pathData.path;
    return (
        <Grid container>
            <Grid item>
                <Typography variant="subtitle1">Path: {path}</Typography>
                <br />
                <Button variant="outlined" color="primary" onClick={onTogglePathBuilder}>
                    toggle path builder
                </Button>
            </Grid>
        </Grid>
    );
}