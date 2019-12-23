import React from 'react';
import {Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditFilter from './Filters.EditFilter';
import {CoreMenuSelect} from '../../../core';

const useStyles = makeStyles(theme => ({
	marginB: {
		marginBottom: theme.spacing(2)
	},
}));

export default function FiltersMainView(props) {
	const {filters, onAddParentFilter, ...restProps} = props;
	const classes = useStyles();
	const filtersIds = Object.keys(filters).map(id => {
		return {id, name: filters[id].name};
	});
	filtersIds.unshift({name: 'New Filter...'});

	const filtersList = Object.keys(filters).map(id => {
		return (
			<Grid key={id} item xs={12} className={classes.marginB}>
				<EditFilter parentFilter={filters[id]} {...restProps} />
			</Grid>
		);
	});
	return (
		<Grid container>
			<Grid item xs={12} className={classes.marginB}>
				<CoreMenuSelect
					options={filtersIds}
					onAdd={onAddParentFilter}
				/>
			</Grid>
			{filtersList}
		</Grid>
	);

}
