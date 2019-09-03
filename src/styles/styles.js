import { emphasize } from '@material-ui/core/styles/colorManipulator';

const style = theme => ({
	formControl: {
		margin: theme.spacing(1),
		padding: theme.spacing(1)
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		flexBasis: '33.33%',
		flexShrink: 0,
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary,
	},
	paper: {
		margin: '8px'
	},
	layoutsListDetails: {
		padding: theme.spacing(1)
	},
	
	bigAvatar: {
		margin: 10,
		width: 60,
		height: 60,
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	field: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: '90%',
	},
	slider: {
		paddingTop: '31.5px'
	},
	sliderContainer: {
		bottom: 0,
		position: 'absolute',
	},
	label: {
		marginLeft: theme.spacing(1),
	},
	input: {
		display: 'flex',
		padding: `${theme.spacing(1) / 4}px`,
	},
	valueContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		flex: 1,
		alignItems: 'center',
		overflow: 'hidden',
	},
	chip: {
		margin: `${theme.spacing(1) / 4}px ${theme.spacing(1) / 4}px`,
	},
	chipFocused: {
		backgroundColor: emphasize(
			theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
			0.08,
		),
	},
	noOptionsMessage: {
		padding: `${theme.spacing(1)}px ${theme.spacing(1) * 2}px`,
	},
	singleValue: {
		fontSize: 16,
	},
	placeholder: {
		position: 'absolute',
		left: 2,
		fontSize: 16,
	},
	margin: {
		margin: theme.spacing(1),
	},
	divider: {
		height: theme.spacing(1) * 2,
	},
	selectStyles: {
		margin: `${theme.spacing(1)}px`,
		input: base => ({
			...base,
			color: theme.palette.text.primary,
			'& input': {
				font: 'inherit',
			},
		}),
	},
	selectControl: {
		margin: theme.spacing(1)
	}
});

export default style;