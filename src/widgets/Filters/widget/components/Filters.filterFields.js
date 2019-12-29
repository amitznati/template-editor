import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, ExpansionPanelSummary, ExpansionPanel, ExpansionPanelDetails, Typography, IconButton, Icon} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {CoreText, CoreSelect} from '../../../core';


const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(1, 1),
	},
	padding: {
		padding: theme.spacing(1)
	},
	noPadding: {
		padding: 0
	},
	marginB: {
		marginBottom: theme.spacing(1),
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular,
	},
	ignoreField: {
		textDecoration: 'line-through'
	}
}));

const filterFields = [
	{name: 'x', label: 'X', type: 'text'},
	{name: 'y', label: 'Y', type: 'text'},
	{name: 'width', label: 'Width', type: 'text'},
	{name: 'height', label: 'Height', type: 'text'},
	{name: 'filterUnits', label: 'Filter Units', type: 'select', options: ['userSpaceOnUse', 'objectBoundingBox']},
	{name: 'primitiveUnits', label: 'Primitive Units', type: 'select', options: ['userSpaceOnUse', 'objectBoundingBox']},
	{name: 'colorInterpolationFilters', label: 'color-interpolation-filters', type: 'select', options: ['sRGB', 'linearRGB']}
];

export default function FilterFields({params, onFilterAttributeChange, ignoreVisible, onIgnoreFilterAttribute}) {

	const classes = useStyles();

	const renderTextField = field => {
		return (
			<CoreText
				value={params[field.name].value}
				label={field.label}
				handleChange={value => onFilterAttributeChange({value, name: field.name})}
				disabled={params[field.name].isIgnore}
			/>
		);
	};

	const renderSelectField = field => {
		return (
			<CoreSelect
				value={params[field.name].value}
				options={field.options.map(o => {return {id: o, name: o};})}
				label={field.label}
				onChange={value => onFilterAttributeChange({value, name: field.name})}
				disabled={params[field.name].isIgnore}
			/>
		);
	};

	const ignoreIcon = (fieldName) => {
		return (
			<IconButton size="small" onClick={(e) => {e.stopPropagation(); onIgnoreFilterAttribute(fieldName);} } >
				<Icon>{params[fieldName].isIgnore ? 'visibility_off' : 'visibility'}</Icon>
			</IconButton>
		);
	};

	const createField = (f, fieldName) => {
		return (
			<Grid container direction="row" justify="flex-start" alignItems="center">
				{ignoreVisible && <Grid item xs={3}>
					{ignoreIcon(fieldName)}
				</Grid>}
				<Grid className={params[fieldName].isIgnore ? classes.ignoreField : ''} item xs={ignoreVisible ? 9 : 12}>
					{f}
				</Grid>
			</Grid>
		);
	};

	const renderField = (field) => {
		switch (field.type) {
		case 'text':
			return createField(renderTextField(field), field.name);
		case 'select':
			return createField(renderSelectField(field), field.name);
		default:
			return null;
		}
	};

	return (
		<ExpansionPanel className={classes.marginB}>
			<ExpansionPanelSummary
				expandIcon={<ExpandMoreIcon />}
			>
				<Typography className={classes.heading}>Filter Props</Typography>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails>
				<Grid container>
					{filterFields.map(field => {
						return (
							<Grid item xs={4} key={field.name} className={classes.padding}>
								{renderField(field)}
							</Grid>
						);
					})}
				</Grid>
			</ExpansionPanelDetails>
		</ExpansionPanel>
	);

}
