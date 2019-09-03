import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FontProperties from './fontProperties';
import PositionProperties from './positionProperties';
import ColorProperties from './colorProperties';

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

export default function LayoutPropertiesList({...props}) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
	const {layout, onPropertyChange} = props;
  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const allFields = {
	  font: {id: 'font', title: 'Font Properties', component: FontProperties},
	  position: {id: 'position', title: 'Position Properties', component: PositionProperties},
	  color: {id: 'color', title: 'Color Properties', component: ColorProperties},
  }
  const fields = {
	  text: [
		  allFields.font, allFields.position, allFields.color
	  ]
  };

  return (
    <div className={classes.root}>
		{fields[layout.type].map((field) => {
			return (
				<ExpansionPanel key={field.id} expanded={expanded === field.title} onChange={handleChange(field.title)}>
					<ExpansionPanelSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls={`panel${field.id}bh-content`}
						id={`panel${field.id}bh-header`}
					>
						<Typography className={classes.heading}>{field.title}</Typography>
						{/* <Typography className={classes.secondaryHeading}>family, size, weigth..</Typography> */}
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						{field.component({layout, onPropertyChange})}
					</ExpansionPanelDetails>
				</ExpansionPanel>
			);
		})}
    </div>
  );
}
