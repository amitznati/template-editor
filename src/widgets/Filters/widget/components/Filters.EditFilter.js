import React from 'react';
import {Grid} from '@material-ui/core';
import FiltersPrimitivesList from './Filters.PrimitivesList';
import EditFilterHeader from './Filters.EditFilterHeader';
import {CoreMenuSelect, CoreExpandableSortablePaper} from '../../../core';
import FilterFields from './Filters.filterFields';

export default function EditFilter({
	parentFilter,
	primitivesNameList,
	onAddFilter,
	onAttributeChange,
	onSortEnd,
	onSortChildrenEnd,
	onDeletePrimitive,
	getChildrenFiltersNamesList,
	onAddChildFilter,
	onSelectSingleChild,
	onFilterAttributeChange,
	onFilterNameChange,
	removeFilterFromLayout,
	onIgnoreFilterAttribute,
	onIgnoreFilter
}) {
	const [ignoreVisible, setIgnoreVisible] = React.useState(false);
	const {id: parentFilterId, primitives} = parentFilter;
	const onAdd = (filterItem) => onAddFilter(parentFilterId, filterItem);
	const actions = [
		{ icon: 'file_copy', name: 'Duplicate' },
		{ icon: 'delete', name: 'Delete', callback: () => removeFilterFromLayout(parentFilterId)},
		{ icon: ignoreVisible ? 'visibility_off' : 'visibility', name: 'Toggle Ignore', callback: () => setIgnoreVisible(!ignoreVisible) },
	];

	const getHeader = () => {
		return (
			<EditFilterHeader
				filter={parentFilter}
				{...{
					ignoreVisible,
					onFilterNameChange,
					onIgnoreFilter
				}}
			/>
		);
	};

	return (
		<CoreExpandableSortablePaper
			header={getHeader()}
			actions={actions}
			disabled={parentFilter.isIgnore}
		>
			<Grid container>
				<Grid item xs={12}>
					<FilterFields
						params={parentFilter.params}
						onFilterAttributeChange={({name, value}) => onFilterAttributeChange({filterId: parentFilterId, name, value})}
						ignoreVisible={ignoreVisible}
						onIgnoreFilterAttribute={(name) => onIgnoreFilterAttribute({filterId: parentFilterId, name})}
					/>
				</Grid>
				<Grid item xs={12}>
					<CoreMenuSelect options={primitivesNameList} onAdd={onAdd} placeHolder="Select Element..."/>
				</Grid>
				<Grid item xs={12}>
					<FiltersPrimitivesList
						{...{
							primitives,
							onAttributeChange,
							onSortEnd,
							onSortChildrenEnd,
							onDeletePrimitive,
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
