import React from 'react';
import {Grid} from '@material-ui/core';
import FiltersList from './FiltersList';
import EditFilterHeader from './Filters.EditFilterHeader';
import {CoreMenuSelect, CoreExpandableSortablePaper} from '../../../core';

export default function EditFilter(props) {
	const [ignoreVisible, setIgnoreVisible] = React.useState(false);
	const {parentFilter, primitivesNameList, onAddFilter, onAttributeChange, onSortEnd, onSortChildrenEnd, onDeleteFilter, getChildrenFiltersNamesList, onAddChildFilter} = props;
	const {id: parentFilterId, primitives: filters} = parentFilter;
	const onAdd = (filterItem) => onAddFilter(parentFilterId, filterItem);
	const actions = [
		{ icon: 'file_copy', name: 'Duplicate' },
		{ icon: 'delete', name: 'Delete' },
		{ icon: ignoreVisible ? 'visibility_off' : 'visibility', name: 'Toggle Ignore', callback: () => setIgnoreVisible(!ignoreVisible) },
	];
	const getHeader = () => {
		return (
			<EditFilterHeader
				filter={parentFilter}
				{...{
					ignoreVisible
				}}
			/>
		);
	};

	return (
		<CoreExpandableSortablePaper
			header={getHeader()}
			actions={actions}
		>
			<Grid container>
				<Grid item xs={12}>
					<CoreMenuSelect options={primitivesNameList} onAdd={onAdd} />
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
		</CoreExpandableSortablePaper>
	);

}
