import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(1, 1)
	},
}));

export default function WidgetTemplateMainView(props) {
	const classes = useStyles();
	return (
		<div className={classes.root} {...props} >
			main view
		</div>
	);
}
