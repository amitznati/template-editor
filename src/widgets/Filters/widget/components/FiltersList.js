import React from 'react';
import Filter from './Filter';
import {Grid, Paper} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {CoreMenuSelect, CoreSortableList} from '../../../core';

const useStyles = makeStyles(theme => ({
	filter: {
		margin: theme.spacing(1, 0),
	},
	filterButtons: {
		textAlign: 'center'
	}
}));

export default function FiltersList(props) {
	const classes = useStyles();
	const {parentFilterId, filters = [], onAttributeChange, onSortEnd, onDeleteFilter, getChildrenFiltersNamesList, onAddChildFilter} = props;
	const renderFilter = (filterToRender, filterChildren, index, onChangeFunc, onDeleteFunc) => {
		const paperKey = `filter-${parentFilterId}-${filterToRender.id}`;
		return (
			<Paper key={paperKey} square className={classes.filter}>
				<Grid container alignItems="center" className={classes.layoutGrid}>
					<Grid item xs={12}>
						<Filter {...{
							filter: filterToRender,
							filterIndex: index,
							onAttributeChange: onChangeFunc,
							onDeleteFilter: onDeleteFunc
						}}>
							{filterChildren}
						</Filter>
					</Grid>
				</Grid>
			</Paper>
		);
	};

	const items = filters.map((filter, index) => {
		let filterChildren = undefined;
		if(filter.children) {
			const filtersNameList = getChildrenFiltersNamesList(filter);
			const filterChildrenItems = filter.children.map((f, i) => {
				const onChangeFunc = ({name, value}) => onAttributeChange({parentFilterId, index, name, value, childIndex: i});
				const onDeleteFunc = () => onDeleteFilter({parentFilterId, index, childIndex: i});
				return renderFilter(f, null, i, onChangeFunc, onDeleteFunc);
			});
			const onAddFilter = (filterItem) => onAddChildFilter(filterItem, filter);
			filterChildren = (
				<Grid container>
					<Grid item xs={12}>
						<CoreMenuSelect options={filtersNameList} onAdd={onAddFilter} />
					</Grid>
					<Grid item xs={12}>
						<CoreSortableList
							items={filterChildrenItems}
							useDragHandle={true}
							onSortEnd={({oldIndex, newIndex}) => onSortEnd({parentFilterId, oldIndex, newIndex, filterIndex: index})}
						/>
					</Grid>
				</Grid>

			);
		}
		const onDeleteFunc = () => onDeleteFilter({parentFilterId, index});
		const onChangeFunc = ({name, value}) => onAttributeChange({parentFilterId, index, name, value});
		return renderFilter(filter, filterChildren, index, onChangeFunc, onDeleteFunc);
	});
	const onSort = ({oldIndex, newIndex}) => onSortEnd({parentFilterId, oldIndex, newIndex});
	return (

		<Grid container>
			<Grid item xs={12} >
				<CoreSortableList
					items={items}
					useDragHandle={true}
					onSortEnd={onSort}
				/>
			</Grid>
		</Grid>
	);
}
