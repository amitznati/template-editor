import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, IconButton, Icon, ExpansionPanelActions, Divider} from '@material-ui/core';
import {sortableHandle} from 'react-sortable-hoc';
import ReorderIcon from '@material-ui/icons/Reorder';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {primitivesAttrs} from '../../Data';
import CoreSpeedActions from '../../../core/CoreSpeedActions';
import FiltersField from './Filters.Field';


const DragHandle = sortableHandle(() => <ReorderIcon style={{cursor: 'move'}}/>);

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(1, 1),
	},
	primitive: {
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

export default function FiltersPrimitive(props) {
	const classes = useStyles();
	const {primitive, onAttributeChange, primitiveIndex, onDeletePrimitive, singleChild, inList, onIgnoreAttribute} = props;

	const [ignoreVisible, setIgnoreVisible] = React.useState(false);
	const itemProps = primitivesAttrs[primitive.groupName];
	const primitiveKey = `primitive-field-${itemProps.name}-${primitiveIndex}`;
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
				const enableValue = primitive.params[d.name].value;
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
	const actions = [];
	if (!singleChild) {
		actions.push({ icon: 'file_copy', name: 'Duplicate' });
		actions.push({ icon: 'delete', name: 'Delete' , callback: onDeletePrimitive});
	}
	actions.push({ icon: ignoreVisible ? 'visibility_off' : 'visibility', name: 'Toggle Ignore', callback: toggleIgnoreVisibility });

	return (
		<ExpansionPanel className={classes.root} disabled={primitive.disabled}>
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
									<Icon>visibility</Icon>
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
						<CoreSpeedActions {...{actions}} />
					</Grid>
				</Grid>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails className={classes.noPadding}>
				<Grid container>
					{Object.keys(itemProps.inputsData).map(name => {
						if (!isEnable(name)) {
							return null;
						}
						const key = `${primitiveKey}-${name}`;
						const col = itemProps.inputsData[name].col;
						let type = itemProps.inputsData[name].type;
						if (itemProps.inputsData[name].variants) {
							const variantValue = primitive.params[itemProps.inputsData[name].variants.key].value;
							type = itemProps.inputsData[name].variants.types[variantValue];
						}
						return (
							<Grid className={classes.primitive} key={key} item xs={col || 4}>
								<FiltersField
									{...{
										name,
										itemProps,
										value: primitive.params[name] && primitive.params[name].value,
										primitiveKey,
										onAttributeChange,
										ignoreVisible,
										inList,
										disabled: primitive.params[name] && primitive.params[name].isIgnore,
										type,
										onIgnoreAttribute
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

			{primitive.params.result && <Divider />}
			{primitive.params.result && <ExpansionPanelActions>
				<Typography variant="subtitle1">{`result="${primitive.params.result.value}"`}</Typography>
			</ExpansionPanelActions>}
		</ExpansionPanel>
	);
}
