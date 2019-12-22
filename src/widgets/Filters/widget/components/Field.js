import React from 'react';
import {Grid, IconButton, Icon, TextField} from '@material-ui/core';
import {CoreColorPickerButton, CoreNumber, CoreSelect, CoreText} from '../../../core';
export default function Field(props) {

	const {name, itemProps, value, filterKey, ignoreVisible, onAttributeChange} = props;
	const renderTextField = (name) => {
		const key = `${filterKey}-${name}-field`;
		return <CoreText key={key}
			handleChange={(v) => onAttributeChange && onAttributeChange({name, value: v })}
			label={name}
			value={value}
		/>;
	};
	const renderNumberField = (name) => {
		const key = `${filterKey}-${name}-field`;
		if (itemProps.inputsData[name].double) {
			const values = value.split(' ');
			const key1 = `${key}-1`;
			const key2 = `${key}-2`;
			return [
				<CoreNumber
					key={key1}
					label={name + '-1'}
					value={values[0]}
					onChange={(v) => onAttributeChange({name, value: `${v} ${values[1]}` })}
				/>,
				<CoreNumber
					key={key2}
					label={name + '-2'}
					value={values[1]}
					onChange={(v) => onAttributeChange({name, value: `${values[0]} ${v}` })}
				/>
			];
		}
		return <CoreNumber
			label={name}
			key={key}
			value={value}
			onChange={(value) => onAttributeChange({name, value })}
		/>;
	};

	const renderSelectField = (name) => {
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
					onChange={(v) => onAttributeChange({name, value: `${v} ${values[1]}` })}
				/>,
				<CoreSelect
					key={key2}
					label={itemProps.inputsData[name].valuesKeys[1]}
					value={values[1]}
					options={options2.map(o => {return {id: o, name: o};})}
					onChange={(v) => onAttributeChange({name, value: `${values[0]} ${v}` })}
				/>
			];
		}
		const options = itemProps[name];
		return <CoreSelect
			label={name}
			value={value}
			key={key}
			options={options.map(o => {return {id: o, name: o};})}
			onChange={(value) => onAttributeChange({name, value})}
		/>;

	};

	const renderColorField = (name) => {
		const key = `${filterKey}-${name}-field`;
		return (
			<CoreColorPickerButton
				key={key}
				btnText={name}
				color={value}
				handleChange={(value) => onAttributeChange({name, value})}
			/>
		);
	};

	const renderTextAreaField = (name) => {
		const key = `${filterKey}-${name}-field`;
		return (
			<TextField
				label={name}
				key={key}
				multiline
				rows="4"
				value={value}
				variant="outlined"
				onChange={(e) => onAttributeChange({name, value: e.target.value })}
			/>
		);
	};
	const ignoreIcon = ignoreVisible && (
		<IconButton size="small" onClick={(e) => {e.stopPropagation();} } >
			<Icon>visibility</Icon>
		</IconButton>
	);
	let fieldToReturn = null;
	const createField = (f, i) => {
		return (
			<Grid key={`${filterKey}-${name}-${i}`} container direction="row" justify="flex-start" alignItems="center">
				{ignoreIcon && <Grid item xs={3}>
					{ignoreIcon}
				</Grid>}
				<Grid item xs={ignoreIcon ? 9 : 12}>
					{f}
				</Grid>
			</Grid>
		);
	};
	if(!['in', 'in2'].includes(name)) {
		const type = itemProps.inputsData[name].type;
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
			return null;
		}
		if (Array.isArray(fieldToReturn)) {
			return fieldToReturn.map(createField);
		}
		return createField(fieldToReturn);
	}
	return null;
}
