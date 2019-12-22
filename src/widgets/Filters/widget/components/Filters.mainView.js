import React from 'react';
import {Grid} from '@material-ui/core';
import SelectFilterDropDown from './SelectFilterDropDown';
import FiltersList from './FiltersList';

export default function FiltersMainView(props) {

	const {filtersNameList, onAddFilter, filters, onAttributeChange, onSortEnd, onSortChildrenEnd, onDeleteFilter, getChildrenFiltersNamesList, onAddChildFilter} = props;
	return (
		<Grid container>
			<Grid item xs={12}>
				<SelectFilterDropDown filtersNameList={filtersNameList} onAddFilter={onAddFilter}/>
			</Grid>
			<Grid item xs={12}>
				<FiltersList {...{filters, onAttributeChange, onSortEnd, onSortChildrenEnd, onDeleteFilter, getChildrenFiltersNamesList, onAddChildFilter}}/>
			</Grid>
		</Grid>
	);

}
