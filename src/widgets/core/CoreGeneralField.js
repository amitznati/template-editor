import React from 'react';
import {Grid, IconButton, Icon, TextField} from '@material-ui/core';
import {CoreColorPickerButton, CoreNumber, CoreSelect, CoreText} from 'core';
export default function CoreGeneralField({
	label, type, key, value, ignoreVisible, onAttributeChange, disabled, onIgnoreAttribute, options,
	min, max, step, isIgnore
}) {
	const renderTextField = () => {
		return <CoreText key={key}
			handleChange={onAttributeChange}
			label={label}
			value={value}
			disabled={disabled}
		/>;
	};
	const renderNumberField = () => {
		return <CoreNumber
			label={label}
			inputProps={{min, max, step}}
			{...{key, value, disabled}}
			onChange={onAttributeChange}
		/>;
	};

	const renderSelectField = () => {
		return <CoreSelect
			label={label}
			value={value}
			key={key}
			options={options.map(o => {return {id: o, name: o};})}
			onChange={onAttributeChange}
			disabled={disabled}
		/>;

	};

	const renderColorField = () => {
		return (
			<CoreColorPickerButton
				key={key}
				btnText={label}
				color={value}
				handleChange={onAttributeChange}
				disabled={disabled}
			/>
		);
	};

	const renderTextAreaField = () => {
		return (
			<TextField
				label={label}
				key={key}
				multiline
				rows="4"
				value={value}
				variant="outlined"
				onChange={(e) => onAttributeChange(e.target.value)}
				disabled={disabled}
			/>
		);
	};

	const ignoreIcon = ignoreVisible && (
		<IconButton size="small" onClick={(e) => {e.stopPropagation(); onIgnoreAttribute();}} >
			<Icon>{isIgnore ? 'visibility_off' : 'visibility'}</Icon>
		</IconButton>
	);
	let fieldToReturn = null;
	const createField = (f) => {
		return (
			<Grid container direction="row" justify="flex-start" alignItems="center">
				{ignoreIcon && <Grid item xs={3}>
					{ignoreIcon}
				</Grid>}
				<Grid item style={{textDecoration: isIgnore ? 'line-through' : 'none'}} xs={ignoreIcon ? 9 : 12}>
					{f}
				</Grid>
			</Grid>
		);
	};

	switch (type) {
	case 'text':
		fieldToReturn = renderTextField();
		break;
	case 'select':
		fieldToReturn = renderSelectField();
		break;
	case 'number':
		fieldToReturn = renderNumberField();
		break;
	case 'color':
		fieldToReturn = renderColorField();
		break;
	case 'textarea':
		fieldToReturn = renderTextAreaField();
		break;
	default:
		fieldToReturn = null;
	}
	return createField(fieldToReturn);
}
