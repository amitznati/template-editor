import React from 'react';
import {Grid, IconButton, Icon, TextField} from '@material-ui/core';
import {CoreColorPickerButton, CoreNumber, CoreSelect, CoreText} from '../../../core';
export default function FiltersField(props) {

	const {name, type, itemProps, value, filterKey, ignoreVisible, onAttributeChange, inList, disabled, onIgnoreAttribute} = props;
	const key = `${filterKey}-${name}-field`;
	const fieldData = itemProps.inputsData[name];
	const renderTextField = () => {
		return <CoreText key={key}
			handleChange={(v) => onAttributeChange && onAttributeChange({name, value: v })}
			label={name}
			value={value}
			disabled={disabled}
		/>;
	};
	const renderNumberField = () => {
		const {double, min, max, step} = fieldData;
		if (double) {
			const values = value ? value.split(' ') : [];
			const key1 = `${key}-1`;
			const key2 = `${key}-2`;
			return [
				<CoreNumber
					key={key1}
					label={name + '-1'}
					value={values[0]}
					inputProps={{min, max, step}}
					onChange={(v) => onAttributeChange({name, value: `${v} ${values[1]}` })}
					disabled={disabled}
				/>,
				<CoreNumber
					key={key2}
					label={name + '-2'}
					value={values[1]}
					inputProps={{min, max, step}}
					onChange={(v) => onAttributeChange({name, value: `${values[0]} ${v}` })}
					disabled={disabled}
				/>
			];
		}
		return <CoreNumber
			label={name}
			inputProps={{min, max, step}}
			{...{key, value, disabled}}
			onChange={(value) => onAttributeChange({name, value })}
		/>;
	};

	const renderSelectField = () => {
		if (fieldData.double) {
			const options1 = itemProps[fieldData.valuesKeys[0]];
			const options2 = itemProps[fieldData.valuesKeys[1]];
			const values = value ? value.split(' ') : [];
			const key1 = `${key}-1`;
			const key2 = `${key}-2`;
			return [
				<CoreSelect
					key={key1}
					label={fieldData.valuesKeys[0]}
					value={values[0]}
					options={options1.map(o => {return {id: o, name: o};})}
					onChange={(v) => onAttributeChange({name, value: `${v} ${values[1]}` })}
					disabled={disabled}
				/>,
				<CoreSelect
					key={key2}
					label={fieldData.valuesKeys[1]}
					value={values[1]}
					options={options2.map(o => {return {id: o, name: o};})}
					onChange={(v) => onAttributeChange({name, value: `${values[0]} ${v}` })}
					disabled={disabled}
				/>
			];
		}
		const options = ['in','in2'].includes(name) ? inList : itemProps[name];
		return <CoreSelect
			label={name}
			value={value}
			key={key}
			options={options.map(o => {return {id: o, name: o};})}
			onChange={(value) => onAttributeChange({name, value})}
			disabled={disabled}
		/>;

	};

	const renderColorField = () => {
		return (
			<CoreColorPickerButton
				key={key}
				btnText={name}
				color={value}
				handleChange={(value) => onAttributeChange({name, value})}
				disabled={disabled}
			/>
		);
	};

	const renderTextAreaField = () => {
		return (
			<TextField
				label={name}
				key={key}
				multiline
				rows="4"
				value={value}
				variant="outlined"
				onChange={(e) => onAttributeChange({name, value: e.target.value })}
				disabled={disabled}
			/>
		);
	};

	const ignoreIcon = ignoreVisible && (
		<IconButton size="small" onClick={(e) => {e.stopPropagation(); onIgnoreAttribute(name);}} >
			<Icon>{disabled ? 'visibility_off' : 'visibility'}</Icon>
		</IconButton>
	);
	let fieldToReturn = null;
	const createField = (f, i) => {
		return (
			<Grid key={`${filterKey}-${name}-${i}`} container direction="row" justify="flex-start" alignItems="center">
				{ignoreIcon && <Grid item xs={3}>
					{ignoreIcon}
				</Grid>}
				<Grid item style={{textDecoration: disabled ? 'line-through' : 'none'}} xs={ignoreIcon ? 9 : 12}>
					{f}
				</Grid>
			</Grid>
		);
	};

	switch (type) {
	case 'text':
		fieldToReturn = renderTextField(name);
		break;
	case 'select':
		fieldToReturn = renderSelectField(name);
		break;
	case 'number':
		fieldToReturn = renderNumberField(name);
		break;
	case 'color':
		fieldToReturn = renderColorField(name);
		break;
	case 'textarea':
		fieldToReturn = renderTextAreaField(name);
		break;
	default:
		fieldToReturn = null;
	}
	if (Array.isArray(fieldToReturn)) {
		return fieldToReturn.map(createField);
	}
	return createField(fieldToReturn, 0);
}
