import React from 'react';
import {Grid} from '@material-ui/core';
import arrayMove from 'array-move';
import SelectFilterDropDown from './components/SelectFilterDropDown';
import FiltersList from './components/FiltersList';
import {primitivesData} from './Data';

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

	const onDeleteFilter = (index, childIndex) => {
		let newFilters = [...filters];
		if (!isNaN(childIndex)) {
			newFilters[index].children.splice(childIndex,1);
		} else {
			newFilters.splice(index, 1);
		}
		setFilters(newFilters);
	};
	const filtersList = primitivesData.map(item => item);
	const onAddFilter = (filter) => {
		setFilters([...filters, filter]);
	};

	return (
		<Grid container>
			<Grid item xs={12}>
				<SelectFilterDropDown filtersData={filtersList} onAdd={onAddFilter} />
			</Grid>
			<Grid item xs={12}>
				<FiltersList {...{filters, onAttributeChange, onSortEnd, onSortChildrenEnd, onDeleteFilter}}/>
			</Grid>
		</Grid>
	);
}
