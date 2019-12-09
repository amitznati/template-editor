import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {primitivesAttrs} from './Data';
import {CoreNumber, CoreSelect, CoreText} from '../core';
import {Grid, TextField} from '@material-ui/core';
import CoreColorPickerButton from '../core/CoreColorPickerButton';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(3, 2),
	},
	filter: {
		display: 'flex',
		padding: theme.spacing(1)
	}
}));

export default function Filter(props) {
	const classes = useStyles();
	const {filter, onAttributeChange, filterIndex} = props;
	const itemProps = primitivesAttrs[filter.groupName];
	const dependencies = [];
	Object.keys(itemProps.inputsData).forEach((name) => {
		const field = itemProps.inputsData[name];
		if (field.dependencies) {
			dependencies.push({name, dependencies: field.dependencies});
		}
	});
	const renderTextField = (name) => {
		const value = filter.params[name].value;
		return <CoreText
			handleChange={(v) => onAttributeChange && onAttributeChange({index: filterIndex,name, value: v })}
			label={name}
			value={value}
		/>;
	};
	const renderNumberField = (name) => {
		const value = filter.params[name].value;
		if (itemProps.inputsData[name].double) {
			const values = filter.params[name].value.split(' ');
			const key1 = `filter-${name}-${values[0]}`;
			const key2 = `filter-${name}-${values[1]}`;
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
			value={value}
			onChange={(v) => onAttributeChange && onAttributeChange({index: filterIndex,name, value: v })}
		/>;
	};

	const renderSelectField = (name) => {
		const value = filter.params[name].value;
		if (itemProps.inputsData[name].double) {
			const options1 = itemProps[itemProps.inputsData[name].valuesKeys[0]];
			const options2 = itemProps[itemProps.inputsData[name].valuesKeys[1]];
			const values = value.split(' ');
			const select1Key = `filter-${name}-${values[0]}`;
			const select2Key = `filter-${name}-${values[1]}`;
			return [
				<CoreSelect
					key={select1Key}
					label={itemProps.inputsData[name].valuesKeys[0]}
					value={values[0]}
					options={options1.map(o => {return {id: o, name: o};})}
					onChange={(v) => onAttributeChange && onAttributeChange({index: filterIndex,name, value: `${v} ${values[1]}` })}
				/>,
				<CoreSelect
					key={select2Key}
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
			options={options.map(o => {return {id: o, name: o};})}
			onChange={(v) => onAttributeChange && onAttributeChange({index: filterIndex,name, value: v })}
		/>;

	};

	const renderColorField = (name) => {
		const value = filter.params[name].value;
		return (
			<CoreColorPickerButton
				btnText={name}
				color={value}
				handleChange={(v) => onAttributeChange && onAttributeChange({index: filterIndex,name, value: v })}
			/>
		);
	};

	const renderTextAreaField = (name) => {
		const value = filter.params[name].value;
		return (
			<TextField
				label={name}
				multiline
				rows="4"
				value={value}
				variant="outlined"
			/>
		);
	};

	const renderField = (name, field) => {
		if(!['in', 'in2'].includes(name)) {
			switch (field.type) {
			case 'text':
				return renderTextField(name);
			case 'select':
				return renderSelectField(name);
			case 'number':
				return renderNumberField(name);
			case 'color':
				return renderColorField(name);
			case 'textarea':
				return renderTextAreaField(name);
			default:
				return null;
			}
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
		<Paper className={classes.root}>
			<Typography variant="h5" component="h3">
				{itemProps.name}
			</Typography>
			<Grid container>
				{Object.keys(itemProps.inputsData).map(name => {
					if (!isEnable(name)) {
						return null;
					}
					const key = `filter-field-${itemProps.name}-${name}`;
					const col = itemProps.inputsData[name].col;
					return (
						<Grid className={classes.filter} key={key} item xs={col || 4}>
							{renderField(name, itemProps.inputsData[name])}
						</Grid>
					);
				})}
			</Grid>
		</Paper>
	);
}
