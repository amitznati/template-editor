import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import {Icon} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	speedDial: {
		position: 'absolute',
		'&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
			bottom: theme.spacing(0),
			right: theme.spacing(4),
		},
		'&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
			top: theme.spacing(2),
			left: theme.spacing(2),
		},
	},
}));

export default function FilterSpeedActions(props)  {
	const {actions} = props;
	const classes = useStyles();
	const [actionOpen, setActionOpen] = React.useState(false);

	return (
		<SpeedDial
			ariaLabel="SpeedDial example"
			className={classes.speedDial}
			FabProps={{color: 'default', size: 'small'}}
			icon={<MoreVertIcon />}
			onClose={() => setActionOpen(false)}
			// onOpen={() => setActionOpen(true)}
			onClick={(e) => {setActionOpen(!actionOpen); e.stopPropagation();}}
			open={actionOpen}
			direction="left"
		>
			{actions.map(action => (
				<SpeedDialAction
					key={action.name}
					icon={<Icon>{action.icon}</Icon>}
					tooltipTitle={action.name}
					onClick={(e) => {
						e.stopPropagation();
						setActionOpen(false);
						action.callback && action.callback();
					}}
				/>
			))}
		</SpeedDial>
	);
}
