import React from 'react';
import {Grid, Paper} from '@material-ui/core';
import FiltersList from './FiltersList';
import EditFilterName from './Filters.EditFilterName';
import {CoreMenuSelect} from '../../../core';

export default function NewFilter(props) {

	const {parentFilter, filtersNameList, onAddFilter, onAttributeChange, onSortEnd, onSortChildrenEnd, onDeleteFilter, getChildrenFiltersNamesList, onAddChildFilter} = props;
	const {id: parentFilterId, name: parentFilterName, filters} = parentFilter;
	const onAdd = (filterItem) => onAddFilter(parentFilterId, filterItem);
	return (
		<Paper style={{padding: '5px'}}>
			<Grid container>
				<Grid item xs={12}>
					<EditFilterName {...{parentFilterId, parentFilterName}} />
				</Grid>
				<Grid item xs={12}>
					<CoreMenuSelect options={filtersNameList} onAdd={onAdd} />
				</Grid>
				<Grid item xs={12}>
					<FiltersList
						{...{
							filters,
							onAttributeChange,
							onSortEnd,
							onSortChildrenEnd,
							onDeleteFilter,
							getChildrenFiltersNamesList,
							onAddChildFilter,
							parentFilterId
						}}
					/>
				</Grid>
			</Grid>
		</Paper>
	);

}
