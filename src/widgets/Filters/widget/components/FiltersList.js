import React from 'react';
import Filter from './Filter';
import {Grid, Paper} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {CoreSortableList} from '../../../core';
import SelectFilterDropDown from './SelectFilterDropDown';

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
	const {filters = [], onAttributeChange, onSortEnd, onSortChildrenEnd, onDeleteFilter, getChildrenFiltersNamesList, onAddChildFilter} = props;
	const renderFilter = (filterToRender, filterChildren, index, onChangeFunc = onAttributeChange, onDeleteFunc) => {
		const paperKey = `filter-${filterToRender.id}`;
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
				const onChangeFunc = ({name, value}) => onAttributeChange({index, name, value, childIndex: i});
				const onDeleteFunc = () => onDeleteFilter(index, i);
				return renderFilter(f, null, i, onChangeFunc, onDeleteFunc);
			});
			const onAddFilter = (filterItem) => onAddChildFilter(filterItem, filter);
			filterChildren = (
				<Grid container>
					<Grid item xs={12}>
						<SelectFilterDropDown filtersNameList={filtersNameList} onAddFilter={onAddFilter} />
					</Grid>
					<Grid item xs={12}>
						<CoreSortableList
							items={filterChildrenItems}
							useDragHandle={true}
							onSortEnd={({oldIndex, newIndex}) => onSortChildrenEnd({oldIndex, newIndex, filterIndex: index})}
						/>
					</Grid>
				</Grid>

			);
		}
		const onDeleteFunc = () => onDeleteFilter(index);
		return renderFilter(filter, filterChildren, index, onAttributeChange, onDeleteFunc);
	});

	return (
		<Grid container>
			<Grid item xs={12} >
				<CoreSortableList
					items={items}
					useDragHandle={true}
					onSortEnd={onSortEnd}
				/>
			</Grid>
		</Grid>
	);
}
