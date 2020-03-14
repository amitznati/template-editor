import React from 'react';
import {withTheme} from '@material-ui/core/styles';
import {Fab, Icon} from '@material-ui/core';

const makeStyles = (theme, props) => ({
	root: {
		display: 'flex',
		flexDirection: props.flexDirection
	},
	action: {
		margin: theme.spacing(props.isSpacingVertical ? 0 : 2, props.isSpacingVertical ? 2 : 0, 0, 0),
	},
	actions: {

		flexDirection: props.flexDirection,
		...props.wraperProps
	},
	actionsWrap: {
		...props.wraperProps,
		display: 'flex',
		position: 'absolute',
		flexDirection: props.flexDirection,
		zIndex: 999
	}
});

class CoreNestedSpeedActions extends React.Component {
	constructor(props) {
		super(props);
		this.rootRef = React.createRef();
		this.state = {
			showActions: false,
			style: {}
		};
	}

	setStyles = () => {
		const {direction = 'right', theme, actions = []} = this.props;
		const styleProps = {flexDirection: 'row', isSpacingVertical: true};
		const ct = actions.length;
		const spacing = theme.spacing(1);
		switch (direction) {
		case 'left':
			styleProps.flexDirection = 'row-reverse';
			styleProps.wraperProps = {left:  `${(this.rootRef.current.offsetLeft - ((this.rootRef.current.offsetHeight + (spacing * 2)) * ct)) }px`};
			break;
		case 'up':
			styleProps.flexDirection = 'column-reverse';
			styleProps.isSpacingVertical = false;
			styleProps.wraperProps = {top: `${(this.rootRef.current.offsetTop - ((this.rootRef.current.offsetHeight + (spacing * 3)) * ct)) + (spacing * 2)}px`};
			break;
		case 'down':
			styleProps.flexDirection = 'column';
			styleProps.isSpacingVertical = false;
			styleProps.wraperProps = {top: `${this.rootRef.current.offsetTop + this.rootRef.current.offsetHeight}px`};
			break;
		case 'right':
			styleProps.wraperProps = {left: `${this.rootRef.current.offsetLeft + this.rootRef.current.offsetWidth + (spacing * 2)}px`};
			break;
		default:
			styleProps.flexDirection = 'row';

		}
		const style = makeStyles(theme, styleProps);
		this.setState({style, offsetTop: this.rootRef.current.offsetTop, offsetLeft: this.rootRef.current.offsetLeft});
	};

	componentDidMount() {
		if (this.rootRef && this.rootRef.current) {
			this.setStyles();
		}
	}

	componentDidUpdate() {
		if (this.rootRef && this.rootRef.current &&
			(this.rootRef.current.offsetTop !== this.state.offsetTop
				||
				this.rootRef.current.offsetLeft !== this.state.offsetLeft)) {
			this.setStyles();
		}
	}

	toggleShowActions = (showActions) => {
		this.setState({showActions});
	};

	renderIcon = (action, index) => {
		const {style} = this.state;
		if (typeof action.icon === 'string') {
			return (
				<Fab
					{...action.fabProps}
					key={`${action.icon}-${index}`}
					style={style.action}
					onClick={action.callback}
				>
					<Icon>{action.icon}</Icon>

				</Fab>
			);
		} else if (action.icon) {
			return action.icon;
		}
	};

	renderAction = (action, index) => {
		const {style} = this.state;
		if (action.isNested) {
			return (
				<div style={style.action} key={`${action.icon}-${index}`}>
					<CoreNestedSpeedActions
						actions={action.actions}
						direction={action.direction}
						icon={action.icon}
						theme={this.props.theme}
						fabProps={action.fabProps}
					/>
				</div>

			);
		} else {
			return this.renderIcon(action, index);
		}
	};


	render() {
		const {showActions, style} = this.state;
		const {actions = [], icon = 'more_vert', fabProps} = this.props;
		const mainIconProps = {icon, fabProps};
		return (
			<div style={style.root}>
				<div ref={this.rootRef} onClick={() => this.toggleShowActions(!showActions)}>
					{this.renderIcon(mainIconProps, 0)}
				</div>

				{showActions && <div style={style.actionsWrap}>
					{actions.map(this.renderAction)}
				</div>}
			</div>

		);
	}

}

export default withTheme(CoreNestedSpeedActions);
