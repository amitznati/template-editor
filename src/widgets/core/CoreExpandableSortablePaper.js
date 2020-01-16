import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails} from '@material-ui/core';
import {sortableHandle} from 'react-sortable-hoc';
import ReorderIcon from '@material-ui/icons/Reorder';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CoreSpeedActions from './CoreSpeedActions';

const DragHandle = sortableHandle(() => <ReorderIcon style={{cursor: 'move'}}/>);

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(1, 1)
	},
	noPadding: {
		padding: 0,
		opacity: '1 !important'
	},
}));


export default function CoreExpandableSortablePaper({header, actions, children, disabled, sortable = true}) {
	const classes = useStyles();
	return (
		<ExpansionPanel className={classes.root} disabled={disabled} >
			<ExpansionPanelSummary
				expandIcon={<ExpandMoreIcon/>}
				className={classes.noPadding}
			>
				<Grid container justify="center" alignItems="center">
					{sortable && <Grid item xs={1}><DragHandle/></Grid>}
					<Grid item xs={10}>
						{header}
					</Grid>
					{actions && <Grid item xs={1}>
						<CoreSpeedActions {...{actions}} />
					</Grid>}
				</Grid>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails className={classes.noPadding}>
				{children}
			</ExpansionPanelDetails>
		</ExpansionPanel>
	);

}
