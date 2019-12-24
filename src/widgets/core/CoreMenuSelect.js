import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {Menu, Button, MenuItem, Icon} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: '100%',
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
		textTransform: 'none'
	},
	button:{
		textTransform: 'none'
	},
	iconButton: {
		padding: 10,
	},
	divider: {
		height: 28,
		margin: 4,
	},
}));

export default function CoreMenuSelect({onAdd = false, options = [], onDelete = false, onSelect}) {
	const classes = useStyles();
	const [state, setState] = React.useState({anchorEl: null});
	const handleClose = () => setState({...state, anchorEl: null});
	const handleSelect = (selectedItem) => {
		setState({anchorEl: null, selectedItem});
		onSelect && onSelect(selectedItem);
	};
	const handleClick = (callback) => {
		const item = {...state.selectedItem};
		callback(item);
		setState({...state, selectedItem: null});
	};

	const list = options.map(item => {
		return <MenuItem key={`${item.id}-${item.name}`} onClick={() => handleSelect(item)}>{item.name}</MenuItem>;
	});
	return (
		<Paper className={classes.root}>
			<div className={classes.input}>
				<Button
					className={classes.button}
					aria-controls="simple-menu"
					aria-haspopup="true"
					onClick={(e) => setState({...state, anchorEl: e.target})}
				>
					{state.selectedItem ? state.selectedItem.name : 'Select Filter'}
				</Button>
				<Menu
					id="simple-menu"
					anchorEl={state.anchorEl}
					keepMounted
					open={Boolean(state.anchorEl)}
					onClose={handleClose}
				>
					{list}
				</Menu>
			</div>
			{onDelete && <IconButton
				color="secondary"
				className={classes.iconButton}
				disabled={!state.selectedItem}
				onClick={() => handleClick(onDelete)}
			>
				<Icon>delete</Icon>
			</IconButton>}
			{onAdd && <Divider className={classes.divider} orientation="vertical" />}
			{onAdd && <IconButton
				color="primary"
				className={classes.iconButton}
				onClick={() => handleClick(onAdd)}
				disabled={!state.selectedItem}
			>
				<Icon>add</Icon>
			</IconButton>}

		</Paper>
	);
}
