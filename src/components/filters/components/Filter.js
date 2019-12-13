import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, IconButton, Icon} from '@material-ui/core';
import {sortableHandle} from 'react-sortable-hoc';
import ReorderIcon from '@material-ui/icons/Reorder';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {primitivesAttrs} from '../Data';
import FilterSpeedActions from './FilterSpeedActions';
import Field from './Field';


const DragHandle = sortableHandle(() => <ReorderIcon style={{cursor: 'move'}}/>);

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(1, 1),
	},
	filter: {
		display: 'flex',
		padding: theme.spacing(1)
	},
	noPadding: {
		padding: 0
	},
	margin: {
		margin: theme.spacing(1),
	},
	exampleWrapper: {
		position: 'relative',
		marginTop: theme.spacing(2),
		height: 380,
	},
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

export default function Filter(props) {
	const classes = useStyles();
	const {filter, onAttributeChange, filterIndex, onDeleteFilter} = props;

	const [ignoreVisible, setIgnoreVisible] = React.useState(false);
	const itemProps = primitivesAttrs[filter.groupName];
	const filterKey = `filter-field-${itemProps.name}-${filterIndex}`;
	const dependencies = [];

	Object.keys(itemProps.inputsData).forEach((name) => {
		const field = itemProps.inputsData[name];
		if (field.dependencies) {
			dependencies.push({name, dependencies: field.dependencies});
		}
	});

	const isEnable = (name) => {
		const geDependenciesByType = (type) => {
			const dependenciesWithNull = dependencies.map((d) => {
				const en = d.dependencies.filter(dep => dep[type] && dep[type].includes(name));
				if (en && en.length) {return d;}
				else return null;
			});
			return dependenciesWithNull.filter(d=> !!d);
		};
		function checkEnable(checkName, checkDependencies) {
			let isEnable = false;
			checkDependencies.forEach(d => {
				const enableValue = filter.params[d.name].value;
				const isEnableDep = d.dependencies.find(dep => dep.value === enableValue && dep[checkName].includes(name));
				if (isEnableDep) {
					isEnable = true;
				}
			});
			return isEnable;
		}
		const enableDependencies = geDependenciesByType('enable');
		const disableDependencies = geDependenciesByType('disable');
		if (enableDependencies && enableDependencies.length) {
			return checkEnable('enable', enableDependencies);
		}
		if (disableDependencies && disableDependencies.length) {
			return !checkEnable('disable', disableDependencies);
		}
		return true;
	};

	const toggleIgnoreVisibility = () => {
		setIgnoreVisible(!ignoreVisible);
	};
	const actions = [
		{ icon: 'file_copy', name: 'Duplicate' },
		{ icon: 'delete', name: 'Delete' , callback: onDeleteFilter},
		{ icon: ignoreVisible ? 'visibility_off' : 'visibility', name: 'Toggle Ignore', callback: toggleIgnoreVisibility },
	];

	return (
		<ExpansionPanel className={classes.root}>
			<ExpansionPanelSummary
				expandIcon={<ExpandMoreIcon/>}
				className={classes.noPadding}
			>
				<Grid container justify="center" alignItems="center">
					<Grid item xs={1}><DragHandle/></Grid>
					<Grid item xs={10}>
						<Grid container direction="row" justify="flex-start" alignItems="center">
							{ignoreVisible && <Grid item xs={2}>
								<IconButton onClick={(e) => {e.stopPropagation();} } size="small">
									<Icon>{'visibility'}</Icon>
								</IconButton>
							</Grid>}
							<Grid item xs={ignoreVisible ? 10 : 12}>
								<Typography variant="subtitle1">
									{itemProps.name}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={1}>
						<FilterSpeedActions {...{actions}} />
					</Grid>
				</Grid>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails className={classes.noPadding}>
				<Grid container>
					{Object.keys(itemProps.inputsData).map(name => {
						if (!isEnable(name)) {
							return null;
						}
						const key = `${filterKey}-${name}`;
						const col = itemProps.inputsData[name].col;
						return (
							<Grid className={classes.filter} key={key} item xs={col || 4}>
								<Field
									{...{
										name,
										itemProps,
										value: filter.params[name] && filter.params[name].value,
										filterKey,
										onAttributeChange: ({name,value}) => onAttributeChange({index: filterIndex,name, value }),
										ignoreVisible
									}}
								/>
							</Grid>
						);
					})}
					{props.children &&
						<Grid item xs={12}>
							{props.children}
						</Grid>
					}
				</Grid>
			</ExpansionPanelDetails>
		</ExpansionPanel>
	);
}
