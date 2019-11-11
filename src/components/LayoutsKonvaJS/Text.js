import React from 'react';
import PropTypes from 'prop-types';
import { Text, useStrictMode } from 'react-konva';
import GradientShapes, {getGradientFill} from './GradientShapes';

useStrictMode(true);
export default class CanvasText extends React.Component {
	static propTypes = {
		name: PropTypes.string,
		onUpdateNode: PropTypes.func,
		gradientData: PropTypes.object,
		selectedFillColorType: PropTypes.string,
		fill: PropTypes.string,
	}

	render() {
		console.log(this.props);
		const {gradientData, selectedFillColorType} = this.props;
		const shapes = [];
		let fill = this.props.fill;
		if (gradientData && gradientData.gradientPointsOnFocus) {
			shapes.push(<GradientShapes {...this.props} />);
		}
		if (selectedFillColorType === 'Gradient' && gradientData) {
			fill = getGradientFill(gradientData);
		}
		shapes.push(<Text key={`text-${this.props.name}`}
			{...this.props}
			ref={node => {
				this.textNode = node;
			}}
			{...fill}
			draggable
			onDragEnd={() => this.props.onUpdateNode(this.textNode)}
		/>
		);
		
		return shapes;
	}
}