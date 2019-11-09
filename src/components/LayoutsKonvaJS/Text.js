import React from 'react';
import PropTypes from 'prop-types';
import { Text, useStrictMode } from 'react-konva';
import GradientShapes from './GradientShapes';

const getGradientFill = (data) => {
	const {palette, EndX, EndY, StartX, StartY} = data;
	const stops = [];
	palette.forEach(p => {
		stops.push(...[p.pos, p.color]);
	});
	return {
		fillPriority: `${data.gradientType.toLowerCase()}-gradient`,
		[`fill${data.gradientType}GradientEndPoint`]: {x: EndX, y: EndY},
		[`fill${data.gradientType}GradientStartPoint`]: {x: StartX, y: StartY},
		[`fill${data.gradientType}GradientColorStops`]: stops,
		fillRadialGradientEndRadius: data.gradientType === 'Radial' ? data.EndRadius : undefined,
		fillRadialGradientStartRadius: data.gradientType === 'Radial' ? data.StartRadius: undefined,
	};
};

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
			console.log(fill);
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