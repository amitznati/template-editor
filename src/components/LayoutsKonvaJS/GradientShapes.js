/* eslint-disable react/prop-types */
import React from 'react';
import { useStrictMode, Arrow, Circle } from 'react-konva';

useStrictMode(true);
export default class GradientShapes extends React.Component {
	render(){
		const {x, y, gradientData, name, scaleX, scaleY, rotation} = this.props;
		const {StartX, StartY, EndX, EndY, EndRadius = 0, gradientType} = gradientData;
		const shapes = [];
		if(gradientType === 'Radial') {
			shapes.push(<Circle
				key={`circleR-${name}`}
				x={(x + StartX)}
				y={(y + StartY)}
				radius={EndRadius}
				stroke="black"
				scaleX={scaleX}
				scaleY={scaleY}
				rotation={rotation}
				{...{
					fill: '',
					fillPriority: 'radial-gradient',
					fillRadialGradientEndPoint: {x: EndX - StartX, y: EndY - StartY},
					fillRadialGradientStartPoint: {x: 0, y: 0},
					fillRadialGradientColorStops: this.props.fillRadialGradientColorStops,
					fillRadialGradientEndRadius: EndRadius,
					fillRadialGradientStartRadius: this.props.StartRadius,
				}}
			/>);
			shapes.push(<Circle
				key={`circleStart-${name}`}
				x={(x + StartX)}
				y={(y + StartY)}
				radius={5}
				fill='black'
				scaleX={scaleX}
				scaleY={scaleY}
				rotation={rotation}
			/>);
			shapes.push(<Circle
				key={`circleEnd-${name}`}
				x={(x + EndX)}
				y={(y + EndY)}
				radius={5}
				fill='black'
				scaleX={scaleX}
				scaleY={scaleY}
				rotation={rotation}
			/>);
			
		}
		shapes.push(<Arrow key={`line-${name}`}
			x={x}
			y={y}
			scaleX={scaleX}
			scaleY={scaleY}
			pointerLength={10}
			pointerWidth={10}
			points={[StartX, StartY, EndX, EndY]}
			fill="black"
			stroke="black"
			strokeWidth={4}
			rotation={rotation}
		/>);

		return shapes;
	}
}
