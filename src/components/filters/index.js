import React from 'react';
import SelectFilterDropDown from './SelectFilterDropDown';
import FiltersList from './FiltersList';
import {Grid} from '@material-ui/core';

export default function Filters(props) {
	const [filters, setFilters] = React.useState([]);
	const onAttributeChange = ({index, name, value}) => {
		const newFilters = filters.map((f,i) => {
			if (i === index) {
				f.params[name].value = value;
			}
			return f;
		});
		setFilters(newFilters);
	};
	return (
		<Grid container>
			<Grid item xs={12}>
				<SelectFilterDropDown onAdd={filter => setFilters([...filters, filter])} />
			</Grid>
			<Grid item xs={12}>
				<FiltersList {...{filters, onAttributeChange}}/>
			</Grid>
		</Grid>
	);
}
