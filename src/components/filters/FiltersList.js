import React from 'react';
import Filter from './Filter';
import {Grid, Paper} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {CoreSortableList} from './../core';
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
	const {filters = [], onAttributeChange, onSortEnd, onSortChildrenEnd} = props;
	const renderFilter = (filterToRender, filterChildren, index, onChangeFunc = onAttributeChange) => {
		const paperKey = `filter-field-${index}`;
		return (
			<Paper key={paperKey} square className={classes.filter}>
				<Grid container alignItems="center" className={classes.layoutGrid}>
					<Grid item xs={12}>
						<Filter {...{filter: filterToRender, filterIndex: index, onAttributeChange: onChangeFunc}} >
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

			const filterChildrenItems = filter.children.map((f, i) => {
				const onChangeFunc = ({index, name, value}) => onAttributeChange({index, name, value, childIndex: i})
				return renderFilter(f, null, i, onChangeFunc);
			});
			filterChildren = (
				<CoreSortableList
					items={filterChildrenItems}
					useDragHandle={true}
					onSortEnd={({oldIndex, newIndex}) => onSortChildrenEnd({oldIndex, newIndex, filterIndex: index})}
				/>
			);
		}
		return renderFilter(filter, filterChildren, index);
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
