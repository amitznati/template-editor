import React from 'react';
import SelectFilterDropDown from './SelectFilterDropDown';
import FiltersList from './FiltersList';
import {Grid} from '@material-ui/core';

export default function Filters(props) {
    const [filters, setFilters] = React.useState([]);
	return (
		<Grid container>
			<Grid item xs={12}>
				<SelectFilterDropDown onAdd={filter => setFilters([...filters, filter])} />
			</Grid>
			<Grid item xs={12}>
				<FiltersList {...{filters}}/>
			</Grid>
		</Grid>
	);
}
