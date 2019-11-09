import React from 'react';
import { Text, useStrictMode } from 'react-konva';
import GradientShapes from './GradientShapes';

useStrictMode(true);
export default function CanvasText(props) {
	const textNode = React.createRef();
	const {gradientData} = props;
	const shapes = [];
	if (gradientData && gradientData.gradientPointsOnFocus) {
		shapes.push(<GradientShapes {...props} />);
	}
	
	shapes.push(<Text key={`text-${props.name}`}
		{...props}
		ref={textNode}
		draggable
		onDragEnd={() => props.onUpdateNode(textNode)}
	/>
	);
	
	return shapes;
}