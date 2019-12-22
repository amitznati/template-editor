import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Fab, Paper, Grid} from '@material-ui/core';
import BackIcon from '@material-ui/icons/KeyboardArrowLeft';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FontProperties from './fontProperties';
import PositionProperties from './positionProperties';
import ColorProperties from './colorProperties';
import PathProperties from './pathProperties';
import FilterProperties from './filtersProperties';
import {pathToObject} from '../../../core/SVGPathBuilder/utils/points';

const useStyles = theme => ({
	root: {
		width: '100%',
	},
	heading: {
		fontSize: theme.typography.pxToRem(16),
		flexShrink: 0,
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(16),
		color: theme.palette.text.secondary,
	},
	paper: {
		margin: theme.spacing(1),
		marginLeft: 0,
		borderRadius: 0
	},
	fab: {
		margin: theme.spacing(1),
	}
});

function LayoutListOpen(props) {
	//const [expanded, setExpanded] = React.useState(false);
	const {layout, onTogglePathBuilder, classes, onBack, onUpdate, isSVGPathBuilderOpen} = props;

	const allFields = {
		font: {id: 'fontProperties', title: 'Font & Text'},
		position: {id: 'positionProperties', title: 'Position'},
		color: {id: 'colorProperties', title: 'Fill Color'},
		path: {id: 'pathProperties', title: 'Path'},
		filters: {id: 'filterProperties', title: 'Filters'}

	};

	const fields = {
		text: [
			allFields.font, allFields.position, allFields.color, allFields.filters
		],
		textPath: [
			allFields.font, allFields.position, allFields.color, allFields.path, allFields.filters
		]
	};

	const onPropertyChange = (name,value) => {
		layout.properties[name] = value;
		onUpdate(layout);
	};

	const onPathChanged = (path) => {
		const points = pathToObject(path);
		const newPathData = {
			...layout.properties.pathData,
			points,
			path
		};
		onPropertyChange('pathData', newPathData);
	};


	const renderProperties = (type) => {
		const {
			layout: {
				properties: {
					text,
					fontSize,
					fontWeight,
					fontStyle,
					fontFamily,
					x,
					y,
					transform,
					fill,
					stroke,
					strokeWidth,
					pathData
				}
			}
		} = props;
		switch(type) {
		case 'fontProperties': {
			return <FontProperties {...{text, fontSize, fontWeight, fontStyle, fontFamily, onPropertyChange}} />;
		}
		case 'positionProperties': {
			return <PositionProperties {...{x, y, transform, onPropertyChange }} />;
		}
		case 'colorProperties': {
			return <ColorProperties {...{fill, strokeWidth, stroke, onPropertyChange}} />;
		}
		case 'pathProperties': {
			return <PathProperties {...{pathData, onTogglePathBuilder, onPathChanged, isSVGPathBuilderOpen}} />;
		}
		case 'filterProperties': {
			return <FilterProperties />;
		}
		default:
			return '';
		}

	};

	return (
		<Paper className={classes.paper}>
			<Fab size="medium" color="secondary" className={classes.fab} onClick={onBack}>
				<BackIcon />
			</Fab>
			<Grid container>
				<div className={classes.root}>
					{fields[layout.type].map((field) => {
						return (
							<ExpansionPanel key={field.id} /* expanded={expanded === field.title} onChange={handleChange(field.title)} */
							>
								<ExpansionPanelSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls={`panel${field.id}bh-content`}
									id={`panel${field.id}bh-header`}
								>
									<Typography className={classes.heading}>{field.title}</Typography>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
									{renderProperties(field.id)}
								</ExpansionPanelDetails>
							</ExpansionPanel>
						);
					})}
				</div>
			</Grid>
		</Paper>
	);
}

LayoutListOpen.propTypes = {
	classes: PropTypes.object.isRequired,
	onBack: PropTypes.func.isRequired,
	layout: PropTypes.object,
	onTogglePathBuilder: PropTypes.func,
	onUpdate: PropTypes.func,
	isSVGPathBuilderOpen: PropTypes.bool
};

export default withStyles(useStyles)(LayoutListOpen);