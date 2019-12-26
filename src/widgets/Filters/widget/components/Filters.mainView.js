import React from 'react';
import {Grid, Typography} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditFilter from './Filters.EditFilter';
import {CoreMenuSelect, CoreSortableList} from '../../../core';

const useStyles = makeStyles(theme => ({
	marginB: {
		marginBottom: theme.spacing(2)
	},
}));

export default function FiltersMainView(props) {
	const {layoutFilters, presetsNames, onAddParentFilter, templateFiltersNamesList, onAddFilterFromPresets,  ...restProps} = props;
	const classes = useStyles();

	const filtersList = layoutFilters.map(f => {
		return (
			<Grid key={f.id} item xs={12} className={classes.marginB}>
				<EditFilter parentFilter={f} {...restProps} />
			</Grid>
		);
	});
	return (
		<Grid container>
			<Grid item xs={12} className={classes.marginB}>
				<Typography variant="subtitle1" gutterBottom>Presets Filters</Typography>
				<CoreMenuSelect
					options={presetsNames}
					onAdd={onAddFilterFromPresets}
					placeHolder="Add Filter From Presets..."
				/>
			</Grid>
			<Grid item xs={12} className={classes.marginB}>
				<Typography variant="subtitle1" gutterBottom>Template Filters</Typography>
				<CoreMenuSelect
					options={templateFiltersNamesList}
					onAdd={onAddParentFilter}
					placeHolder="Add Filter From Template..."
				/>
			</Grid>
			<Grid item xs={12}>
				<Typography variant="subtitle1" gutterBottom>Layout Filters List</Typography>
				<CoreSortableList
					items={filtersList}
					useDragHandle={true}
				/>
			</Grid>
		</Grid>
	);

}
