import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Icon, Divider, IconButton, Paper} from '@material-ui/core';
import {CoreText} from '../../../core';

const useStyles = makeStyles(theme => ({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: '100%',
		marginBottom: theme.spacing(2)
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
	divider: {
		height: 28,
		margin: 4,
	},
}));

export default function EditFilterName({parentFilterId, parentFilterName}) {
	const classes = useStyles();

	return (
		<Paper className={classes.root}>
			<CoreText
				label="Filter Name"
				value={parentFilterName}
			/>
			<IconButton color="secondary" className={classes.iconButton} >
				<Icon>delete</Icon>
			</IconButton>
			<Divider className={classes.divider} orientation="vertical" />
			<IconButton color="primary" className={classes.iconButton} >
				<Icon>add</Icon>
			</IconButton>
		</Paper>
	);
}
