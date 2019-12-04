import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {Menu, Button, MenuItem} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import {primitivesData, primitivesAttrs} from './Data';

const useStyles = makeStyles(theme => ({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: 400,
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

export default function SelectFilterDropDown() {
	const classes = useStyles();
	const [state, setState] = React.useState({anchorEl: null});
	const handleClose = () => setState({...state, anchorEl: null});
	const handleSelect = (selectedName, selectedItem) => {setState({anchorEl: null, selectedName, selectedItem});};
	const handleAdd = () => {
		console.log('add', state.selectedItem);
		setState({...state, selectedItem: '', selectedName: ''});
	};
	const filtersList = primitivesData.map(item => {
		const groupData = primitivesAttrs[item.groupName];
		let name = item.name;
		if (item.groupName) {
			// primitives
			name = groupData.name;
		}
		return <MenuItem key={name} onClick={() => handleSelect(name, item)}>{name}</MenuItem>;
	});
	return (
		<Paper component="form" className={classes.root}>
			<div className={classes.input}>
				<Button
					className={classes.button}
					aria-controls="simple-menu"
					aria-haspopup="true"
					onClick={(e) => setState({...state, anchorEl: e.target})}
				>
					{state.selectedName || 'Select Filter'}
				</Button>
				<Menu
					id="simple-menu"
					anchorEl={state.anchorEl}
					keepMounted
					open={Boolean(state.anchorEl)}
					onClose={handleClose}
				>
					{filtersList}
				</Menu>
			</div>

			<Divider className={classes.divider} orientation="vertical" />
			<IconButton
				color="primary"
				className={classes.iconButton}
				onClick={handleAdd}
				disabled={!state.selectedItem}
			>
				<AddIcon />
			</IconButton>
		</Paper>
	);
}
