import React from 'react';
import {Grid} from '@material-ui/core';
import FiltersPrimitivesList from './Filters.PrimitivesList';
import EditFilterHeader from './Filters.EditFilterHeader';
import {CoreMenuSelect, CoreExpandableSortablePaper} from '../../../core';

export default function EditFilter({
	parentFilter,
	primitivesNameList,
	onAddFilter,
	onAttributeChange,
	onSortEnd,
	onSortChildrenEnd,
	onDeleteFilter,
	getChildrenFiltersNamesList,
	onAddChildFilter,
	onSelectSingleChild
}) {
	const [ignoreVisible, setIgnoreVisible] = React.useState(false);
	const {id: parentFilterId, primitives} = parentFilter;
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
					<FiltersPrimitivesList
						{...{
							primitives,
							onAttributeChange,
							onSortEnd,
							onSortChildrenEnd,
							onDeleteFilter,
							getChildrenFiltersNamesList,
							onAddChildFilter,
							parentFilterId,
							onSelectSingleChild
						}}
					/>
				</Grid>
			</Grid>
		</CoreExpandableSortablePaper>
	);

}
