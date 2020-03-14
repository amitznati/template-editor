import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {ListSubheader, List, ListItem, ListItemText, Collapse, Drawer, SvgIcon} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
	root: {
		width: 360,
		backgroundColor: theme.palette.background.paper,
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
}));

const TextPathIcon = () => {
	return (
		<SvgIcon>
			<path id="TextPathIconPath" fill="none" stroke="black" strokeWidth="0.7px" d="M 2.3656 21.7579 Q 19.3923 15.1504 18.7581 3.839" />
			<text fontFamily="Roboto" fontSize="16" fontWeight="500" fill="black">
				<textPath href="#TextPathIconPath">A B</textPath>
			</text>
		</SvgIcon>
	);
};

const items = [
	{isList: true, key: 'textCategory', text: 'Text Layouts', items: [
		{text: 'Simple Text', icon: <i className="material-icons">text_format</i>, key: 'text', defaultValue: 'text'},
		{text: 'Text Path', key: 'textPath', defaultValue: 'text path', icon: <TextPathIcon/>}
	]},
	{text: 'Image', icon: <i className="material-icons">image</i>, key: 'image'}
];

export default function AddNewLayoutList({open, onClose, onSelect}) {
	const classes = useStyles();
	const [state, setState] = React.useState({});

	const handleClick = (item) => {
		if (item.isList) {
			setState({...state, [item.key]: !state[item.key]});
		} else if (onSelect) {
			onSelect({type: item.key, value: item.defaultValue});
		}
	};


	const renderItem = (item) => {
		return (
			<ListItem key={item.key} button onClick={() => handleClick(item)}>
				{item.icon}
				<ListItemText primary={item.text} />
				{item.isList && (state[item.key] ? <ExpandLess /> : <ExpandMore />)}
			</ListItem>
		);
	};

	const renderItems = (items) => {
		const itemsToReturn = [];
		items.forEach((item) => {
			itemsToReturn.push(renderItem(item));
			if (item.isList) {
				itemsToReturn.push(
					<Collapse key={`collapse-${item.key}`} in={state[item.key]} timeout="auto" unmountOnExit>
						<List className={classes.nested} component="div" disablePadding>
							{renderItems(item.items)}
						</List>
					</Collapse>
				);
			}
		});
		return itemsToReturn;
	};


	return (
		<Drawer anchor="left" open={open} onClose={onClose}>
			<List
				component="nav"
				aria-labelledby="nested-list-subheader"
				subheader={
					<ListSubheader component="div" id="nested-list-subheader">
						Add New Layout
					</ListSubheader>
				}
				className={classes.root}
			>
				{renderItems(items)}
			</List>
		</Drawer>
	);
}
