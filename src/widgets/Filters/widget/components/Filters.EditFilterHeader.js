import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Icon, IconButton, Grid} from '@material-ui/core';
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

export default function EditFilterName({filter, ignoreVisible, onNameChange}) {
	const classes = useStyles();

	return (
		<Grid className={classes.grid} container direction="row" justify="flex-start" alignItems="center">
			{ignoreVisible && <Grid item xs={2}>
				<IconButton onClick={(e) => {e.stopPropagation();} } size="small">
					<Icon>visibility</Icon>
				</IconButton>
			</Grid>}
			<Grid item xs={ignoreVisible ? 10 : 12}>
				<CoreText
					label="Filter Name"
					value={filter.name}
					handleChange={onNameChange}
				/>
			</Grid>
		</Grid>
	);
}
