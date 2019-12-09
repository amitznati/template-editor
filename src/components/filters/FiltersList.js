import React from 'react';
import Filter from './Filter';
import {Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
	filter: {
		margin: theme.spacing(1, 0),
	},
}));
export default function FiltersList(props) {
	const classes = useStyles();
	const {filters = [], onAttributeChange} = props;
	return (
		<Grid container>
			{filters.map((filter, index) => {
				return (
					<Grid className={classes.filter} key={`filter-${index}`} item xs={12}>
						<Filter {...{filter, filterIndex: index, onAttributeChange}} />
					</Grid>
				);
			})}
		</Grid>
	);
}
