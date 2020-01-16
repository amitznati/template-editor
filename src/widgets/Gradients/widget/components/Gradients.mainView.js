import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SelectGradient from './Gradients.SelectGradient';
import EditGradient from './Gradients.EditGradient';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(2, 0)
	},
}));

export default function GradientsMainView({selectedGradient, editGradientProps, selectGradientProps}) {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			{selectedGradient ?
				<EditGradient {...editGradientProps}
				/>
				:
				<SelectGradient {...selectGradientProps}/>
			}
		</div>
	);
}
