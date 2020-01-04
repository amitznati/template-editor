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
	const {parentFilterId, primitives = [], onAttributeChange, onSortEnd, onDeletePrimitive, getChildrenFiltersNamesList, onAddChildFilter, onSelectSingleChild, onIgnoreAttribute} = props;
	const fullInList = primitives.map((p,i) => {return {id: p.id, index: i};});
	const defaultInList = ['SourceGraphic', 'SourceAlpha', 'BackgroundImage', 'BackgroundAlpha', 'FillPaint', 'StrokePaint'];
	const renderFilter = (primitiveToRender, filterChildren, index, onChangeFunc, onDeleteFunc, key, singleChild, onIgnoreAttributeFunc) => {
		return (
			<Paper key={key} square className={classes.filter}>
				<Grid container alignItems="center" className={classes.layoutGrid}>
					<Grid item xs={12}>
						<FiltersPrimitive {...{
							primitive: primitiveToRender,
							filterIndex: index,
							onAttributeChange: onChangeFunc,
							onDeletePrimitive: onDeleteFunc,
							singleChild,
							inList: fullInList.map(i => i.id).concat(defaultInList),
							onIgnoreAttribute: onIgnoreAttributeFunc
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
				const onDeleteFunc = () => onDeletePrimitive({parentFilterId, index, childIndex: i});
				const onIgnoreAttributeFunc = (name) => onIgnoreAttribute({name, filterId: parentFilterId, primitiveIndex: index, childIndex: i});
				const onSelectChild = () => {
					onSelectSingleChild({
						parentFilterId,
						primitive,
						childPrimitive
					});
				};

				const key = `filter-${parentFilterId}-${childPrimitive.id}-${i}`;
				if (!hasSingleChild) {
					return renderFilter(childPrimitive, null, i, onChangeFunc, onDeleteFunc, key ,false, onIgnoreAttributeFunc);
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
			const onAddFilter = (filterItem) => onAddChildFilter(filterItem, primitive, parentFilterId);
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
		const onDeleteFunc = () => onDeletePrimitive({parentFilterId, index});
		const onChangeFunc = ({name, value}) => onAttributeChange({parentFilterId, index, name, value});
		const onIgnoreAttributeFunc = (name) => onIgnoreAttribute({name, filterId: parentFilterId, primitiveIndex: index});
		return renderFilter(primitive, filterChildren, index, onChangeFunc, onDeleteFunc, parentKey, false, onIgnoreAttributeFunc);
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
