import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, TextField, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, IconButton, Icon, Fab  } from '@material-ui/core';
import {sortableHandle} from 'react-sortable-hoc';
import ReorderIcon from '@material-ui/icons/Reorder';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {primitivesAttrs} from './Data';
import {CoreNumber, CoreSelect, CoreText, CoreColorPickerButton} from '../core';

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
	}
}));

export default function Filter(props) {
	const classes = useStyles();
	const {filter, onAttributeChange, filterIndex} = props;
	const itemProps = primitivesAttrs[filter.groupName];
	const filterKey = `filter-field-${itemProps.name}-${filterIndex}`;
	const dependencies = [];
	Object.keys(itemProps.inputsData).forEach((name) => {
		const field = itemProps.inputsData[name];
		if (field.dependencies) {
			dependencies.push({name, dependencies: field.dependencies});
		}
	});
	const renderTextField = (name) => {
		const value = filter.params[name].value;
		const key = `${filterKey}-${name}-field`;
		return <CoreText key={key}
			handleChange={(v) => onAttributeChange && onAttributeChange({index: filterIndex,name, value: v })}
			label={name}
			value={value}
		/>;
	};
	const renderNumberField = (name) => {
		const value = filter.params[name].value;
		const key = `${filterKey}-${name}-field`;
		if (itemProps.inputsData[name].double) {
			const values = filter.params[name].value.split(' ');
			const key1 = `${key}-1`;
			const key2 = `${key}-2`;
			return [
				<CoreNumber
					key={key1}
					label={name + '-1'}
					value={values[0]}
					onChange={(v) => onAttributeChange && onAttributeChange({index: filterIndex,name, value: `${v} ${values[1]}` })}
				/>,<CoreNumber
					key={key2}
					label={name + '-2'}
					value={values[1]}
					onChange={(v) => onAttributeChange && onAttributeChange({index: filterIndex,name, value: `${values[0]} ${v}` })}
				/>
			];
		}
		return <CoreNumber
			label={name}
			key={key}
			value={value}
			onChange={(v) => onAttributeChange && onAttributeChange({index: filterIndex,name, value: v })}
		/>;
	};

	const renderSelectField = (name) => {
		const value = filter.params[name].value;
		const key = `${filterKey}-${name}-field`;
		if (itemProps.inputsData[name].double) {
			const options1 = itemProps[itemProps.inputsData[name].valuesKeys[0]];
			const options2 = itemProps[itemProps.inputsData[name].valuesKeys[1]];
			const values = value.split(' ');
			const key1 = `${key}-1`;
			const key2 = `${key}-2`;
			return [
				<CoreSelect
					key={key1}
					label={itemProps.inputsData[name].valuesKeys[0]}
					value={values[0]}
					options={options1.map(o => {return {id: o, name: o};})}
					onChange={(v) => onAttributeChange && onAttributeChange({index: filterIndex,name, value: `${v} ${values[1]}` })}
				/>,
				<CoreSelect
					key={key2}
					label={itemProps.inputsData[name].valuesKeys[1]}
					value={values[1]}
					options={options2.map(o => {return {id: o, name: o};})}
					onChange={(v) => onAttributeChange && onAttributeChange({index: filterIndex,name, value: `${values[0]} ${v}` })}
				/>
			];
		}
		const options = itemProps[name];
		return <CoreSelect
			label={name}
			value={value}
			key={key}
			options={options.map(o => {return {id: o, name: o};})}
			onChange={(v) => onAttributeChange && onAttributeChange({index: filterIndex,name, value: v })}
		/>;

	};

	const renderColorField = (name) => {
		const value = filter.params[name].value;
		const key = `${filterKey}-${name}-field`;
		return (
			<CoreColorPickerButton
				key={key}
				btnText={name}
				color={value}
				handleChange={(v) => onAttributeChange && onAttributeChange({index: filterIndex,name, value: v })}
			/>
		);
	};

	const renderTextAreaField = (name) => {
		const value = filter.params[name].value;
		const key = `${filterKey}-${name}-field`;
		return (
			<TextField
				label={name}
				key={key}
				multiline
				rows="4"
				value={value}
				variant="outlined"
				onChange={(e) => onAttributeChange && onAttributeChange({index: filterIndex,name, value: e.target.value })}
			/>
		);
	};

	const renderField = (name, field) => {
		const deleteKey = `${filterKey}-${name}-delete`;
		const fieldToReturn = [<IconButton size="small" key={deleteKey}><Icon>visibility</Icon></IconButton>];
		if(!['in', 'in2'].includes(name)) {
			switch (field.type) {
			case 'text':
				fieldToReturn.push(renderTextField(name));
				break;
			case 'select':
				fieldToReturn.push(renderSelectField(name));
				break;
			case 'number':
				fieldToReturn.push(renderNumberField(name));
				break;
			case 'color':
				fieldToReturn.push(renderColorField(name));
				break;
			case 'textarea':
				fieldToReturn.push(renderTextAreaField(name));
				break;
			default:
				return null;
			}
			return fieldToReturn;
		}

	};
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

	return (
		<ExpansionPanel className={classes.root}>
			<ExpansionPanelSummary
				expandIcon={<ExpandMoreIcon/>}
				className={classes.noPadding}
			>
				<Grid container justify="center" alignItems="center">
					<Grid item xs={1}><DragHandle/></Grid>
					<Grid item xs={10}>
						<Typography variant="subtitle1">
							{itemProps.name}
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<Fab size='small'><DeleteIcon /></Fab>
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
								{renderField(name, itemProps.inputsData[name])}
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
