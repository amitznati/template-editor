import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {primitivesAttrs} from './Data';
import {CoreNumber, CoreSelect, CoreText} from '../core';
import {Grid} from '@material-ui/core';
import CoreColorPickerButton from '../core/CoreColorPickerButton';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(3, 2),
	},
}));

export default function Filter(props) {
	const classes = useStyles();
	const {filter} = props;
	const itemProps = primitivesAttrs[filter.groupName];
	const renderTextField = ({name, value}) => {
		return <CoreText
			label={name}
			value={value}
		/>;
	};
	const renderNumberField = ({name, value}) => {
		return <CoreNumber
			label={name}
			value={value}
		/>;
	};
	const renderSelectField = ({name, value, options}) => {
		return <CoreSelect
			label={name}
			value={value}
			options={options.map(o => {return {id: o, name: o};})}
		/>;
	};
	const renderColorField = ({name, value}) => {
		return <CoreColorPickerButton btnText={name} color={value} />
	};

	const renderField = (name, field) => {
		if(!['in', 'in2'].includes(name)) {
			switch (field.type) {
			case 'text':
				return renderTextField({name, value: filter.params[name].value});
			case 'select':
				return renderSelectField({name, value: filter.params[name].value, options: itemProps[name]});
			case 'number':
				return renderNumberField({name, value: filter.params[name].value});
			case 'color':
				return renderColorField({name, value: filter.params[name].value});
			default:
				return null;
			}
		}
	};
	return (
		<Paper className={classes.root}>
			<Typography variant="h5" component="h3">
				{itemProps.name}
			</Typography>
			<Grid container>
				{Object.keys(itemProps.inputsData).map(name => {
					return (
						<Grid key={`filter-field-${itemProps.name}-${name}`} item xs={3}>
							{renderField(name, itemProps.inputsData[name])}
						</Grid>
					);
				})}
			</Grid>
		</Paper>
	);
}
