import React from 'react';
import FiltersPrimitive from './Filters.Primitive';
import {Grid, Paper, Radio} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {CoreMenuSelect, CoreSortableList} from '../../../core';
import {primitivesAttrs} from '../../Data';

const useStyles = makeStyles(theme => ({
	filter: {
		margin: theme.spacing(1, 0),
	},
	filterButtons: {
		textAlign: 'center'
	}
}));

export default function FiltersPrimitivesList(props) {
	const classes = useStyles();
	const {parentFilterId, primitives = [], onAttributeChange, onSortEnd, onDeleteFilter, getChildrenFiltersNamesList, onAddChildFilter, onSelectSingleChild} = props;
	const fullInList = primitives.map((p,i) => {return {id: p.id, index: i}});
	const renderFilter = (primitiveToRender, filterChildren, index, onChangeFunc, onDeleteFunc, key, singleChild) => {
		return (
			<Paper key={key} square className={classes.filter}>
				<Grid container alignItems="center" className={classes.layoutGrid}>
					<Grid item xs={12}>
						<FiltersPrimitive {...{
							filter: primitiveToRender,
							filterIndex: index,
							onAttributeChange: onChangeFunc,
							onDeleteFilter: onDeleteFunc,
							singleChild,
							inList: fullInList.filter(i => i.index < index).map(i => i.id)
						}}>
							{filterChildren}
						</FiltersPrimitive>
					</Grid>
				</Grid>
			</Paper>
		);
	};

	const items = primitives.map((primitive, index) => {
		let filterChildren = undefined;
		const {hasSingleChild} = primitivesAttrs[primitive.groupName];
		const parentKey = `filter-${parentFilterId}-${primitive.id}-${index}`;
		if(primitive.children) {
			const filtersNameList = getChildrenFiltersNamesList(primitive);
			const filterChildrenItems = primitive.children.map((childPrimitive, i) => {
				const onChangeFunc = ({name, value}) => onAttributeChange({parentFilterId, index, name, value, childIndex: i});
				const onDeleteFunc = () => onDeleteFilter({parentFilterId, index, childIndex: i});
				const onSelectChild = () => {
					onSelectSingleChild({
						parentFilterId,
						primitive,
						childPrimitive
					});
				};

				const key = `filter-${parentFilterId}-${childPrimitive.id}-${i}`;
				if (!hasSingleChild) {
					return renderFilter(childPrimitive, null, i, onChangeFunc, onDeleteFunc, key ,false);
				}
				return (
					<Grid container key={key} alignItems="center">
						<Grid item xs={1}>
							<Radio checked={!childPrimitive.disabled} onChange={onSelectChild} />
						</Grid>
						<Grid item xs={11}>
							{renderFilter(childPrimitive, null, i, onChangeFunc, onDeleteFunc, `${key}-child`, true)}
						</Grid>
					</Grid>
				);
			});
			const onAddFilter = (filterItem) => onAddChildFilter(filterItem, primitive);
			filterChildren = (
				<Grid container>
					{!hasSingleChild && <Grid item xs={12}>
						<CoreMenuSelect options={filtersNameList} onAdd={onAddFilter} />
					</Grid>}
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
		return renderFilter(primitive, filterChildren, index, onChangeFunc, onDeleteFunc, parentKey);
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
