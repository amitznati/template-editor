/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Transformer from './subjx';
export default class CanvasText extends React.Component {
	textRef = React.createRef();
	static propTypes = {
		onUpdateNode: PropTypes.func
	}


	render() {
		return (
			<Transformer>
				<text
					{...this.props}
					className={cx('drag-svg')}
					ref={this.textRef}
				>
					{this.props.text}
				</text>
			</Transformer>
			
		);
	}
}