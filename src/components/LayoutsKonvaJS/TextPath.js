/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { TextPath, useStrictMode} from 'react-konva';
import GradientShapes, {getGradientFill} from './GradientShapes';

useStrictMode(true);
export default class CanvasTextPath extends React.Component {
	textPathNode = React.createRef();
	static propTypes = {
		onUpdateNode: PropTypes.func
	}

	render() {
		const {gradientData, pathData, selectedFillColorType} = this.props;
		const path = (pathData && pathData.path) || `M ${0} ${0} L ${100} ${0}`;
		let fill = this.props.fill;
		const shapes = [];
		if (gradientData && gradientData.gradientPointsOnFocus) {
			shapes.push(<GradientShapes {...this.props} />);
		}
		if (selectedFillColorType === 'Gradient' && gradientData) {
			fill = getGradientFill(gradientData);
		}
		shapes.push(
			<TextPath 
				key={`textPath-${this.props.name}`}
				{...this.props}
				ref={node => {
					this.textPathNode = node;
				}}
				{...fill}
				draggable
				onDragEnd={() => this.props.onUpdateNode(this.textPathNode)}
				data={path}
			/>
		);
		return shapes;
	}
}