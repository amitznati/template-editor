/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Text, useStrictMode } from 'react-konva';
import GradientShapes from './GradientShapes';

useStrictMode(true);
export default class CanvasText extends React.Component {
	static propTypes = {
		onUpdateNode: PropTypes.func
	}

	render() {
		const {gradientData} = this.props;
		const shapes = [];
		if (gradientData && gradientData.gradientPointsOnFocus) {
			shapes.push(<GradientShapes {...this.props} />);
		}
		
		shapes.push(<Text key={`text-${this.props.name}`}
			{...this.props}
			ref={node => {
				this.textNode = node;
			}}
			draggable
			onDragEnd={() => this.props.onUpdateNode(this.textNode)}
		/>
		);
		
		return shapes;
	}
}