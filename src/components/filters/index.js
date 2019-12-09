import React from 'react';
import {Grid} from '@material-ui/core';
import arrayMove from 'array-move';
import SelectFilterDropDown from './SelectFilterDropDown';
import FiltersList from './FiltersList';

export default function Filters(props) {
	const [filters, setFilters] = React.useState([]);
	const onAttributeChange = ({index, name, value, childIndex}) => {
		const newFilters = filters.map((f,i) => {
			if (i === index) {
				if (!isNaN(childIndex)) {
					f.children[childIndex].params[name].value = value;
				} else {
					f.params[name].value = value;
				}
			}
			return f;
		});
		setFilters(newFilters);
	};
	const onSortEnd = ({oldIndex, newIndex}) => {
		const newFilters = arrayMove(filters, oldIndex, newIndex);
		setFilters(newFilters);
	};
	const onSortChildrenEnd = ({oldIndex, newIndex, filterIndex}) => {
		const newFilters = filters.map((f,i) => {
			if (i === filterIndex) {
				f.children = arrayMove(f.children, oldIndex, newIndex);
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
				<FiltersList {...{filters, onAttributeChange, onSortEnd, onSortChildrenEnd}}/>
			</Grid>
		</Grid>
	);
}
