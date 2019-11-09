import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FontProperties from './fontProperties';
import PositionProperties from './positionProperties';
import ColorProperties from './colorProperties';
import PathProperties from './pathProperties';

const useStyles = makeStyles(theme => ({
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
}));

function LayoutPropertiesList({...props}) {
	const classes = useStyles();
	//const [expanded, setExpanded] = React.useState(false);
	const {layout, onPropertyChange, onTogglePathBuilder} = props;
	// const handleChange = panel => (event, isExpanded) => {
	//	 setExpanded(isExpanded ? panel : false);
	// };
	const allFields = {
		font: {id: 'fontProperties', title: 'Font Properties'},
		position: {id: 'positionProperties', title: 'Position Properties'},
		color: {id: 'colorProperties', title: 'Color Properties'},
		path: {id: 'pathProperties', title: 'Path Properties'}
		
	};
	
	const fields = {
		text: [
			allFields.font, allFields.position, allFields.color
		],
		textPath: [
			allFields.font, allFields.position, allFields.color, allFields.path
		]
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
			return <PathProperties {...{pathData, onTogglePathBuilder}} />;
		}
		default:
			return '';
		}
	};

	return (
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
							{/* <Typography className={classes.secondaryHeading}>family, size, weigth..</Typography> */}
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							{renderProperties(field.id)}
						</ExpansionPanelDetails>
					</ExpansionPanel>
				);
			})}
		</div>
	);
}

LayoutPropertiesList.propTypes = {
	layout: PropTypes.object,
	onTogglePathBuilder: PropTypes.func,
	onPropertyChange: PropTypes.func
};

export default LayoutPropertiesList;