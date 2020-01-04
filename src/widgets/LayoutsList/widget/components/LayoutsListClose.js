import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid,Paper, Fab} from '@material-ui/core';
import {sortableHandle} from 'react-sortable-hoc';
import ReorderIcon from '@material-ui/icons/Reorder';
import DeleteIcon from '@material-ui/icons/Delete';
import {ImageLayoutHeader, TextLayoutHeader} from './layoutsHeaders';
import {CoreSortableList} from './../../../core';

const DragHandle = sortableHandle(() => <ReorderIcon style={{cursor: 'move'}}/>);

const styles = theme => ({

	layoutPaper: {
		margin: theme.spacing(1, 0),
		marginLeft: 0,
		padding: theme.spacing(1),
	},
	layoutGrid: {
		//height: '50px'
	}
});
class LayoutsListClose extends React.Component {

	onDeleteLayout(e,i){
		e.stopPropagation();
		this.props.onDeleteLayout(i);

	}
	getLayoutHeader(l,i){
		switch(l.type) {
		case 'image':
			return <ImageLayoutHeader key={i} layout={l}/>;
		case 'text':
		case 'textPath':
			return <TextLayoutHeader key={i} layout={l}/>;
		default:
			return '';
		}
	}
	renderLayout(l,i) {
		const {classes} = this.props;
		return (
			<Paper square className={classes.layoutPaper}>
				<Grid container alignItems="center" className={classes.layoutGrid}>
					<Grid item xs={2}><DragHandle/></Grid>
					<Grid item xs={8}>
						{this.getLayoutHeader(l,i)}
					</Grid>
					<Grid item xs={2}>
						<Fab size='small'>
							<DeleteIcon onClick={(e)=>this.onDeleteLayout(e,i)}/>
						</Fab>
					</Grid>
				</Grid>
			</Paper>

		);

	}

	render() {
		const {layouts, onSortEnd, onLayoutClick} = this.props;
		const items = layouts.map((l,i) => this.renderLayout(l,i));
		return (
			<Grid container >
				<Grid item xs={12} >
					<CoreSortableList
						items={items}
						useDragHandle={true}
						onItemClick={onLayoutClick}
						onSortEnd={onSortEnd}
					/>
				</Grid>
			</Grid>
		);
	}
}
LayoutsListClose.propTypes = {
	classes: PropTypes.object.isRequired,
	layouts: PropTypes.array.isRequired,
	onSortEnd: PropTypes.func,
	onLayoutClick: PropTypes.func,
	onDeleteLayout: PropTypes.func
};

export default withStyles(styles)(LayoutsListClose);
