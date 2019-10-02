/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { TextPath, useStrictMode} from 'react-konva';
import GradientShapes from './GradientShapes';

useStrictMode(true);
export default class CanvasTextPath extends React.Component {
	textPathNode = React.createRef();
	static propTypes = {
		onUpdateNode: PropTypes.func
	}

	render() {
		const {gradientData, pathData} = this.props;
		const path = (pathData && pathData.path) || `M ${0} ${0} L ${100} ${0}`;
		const shapes = [
			<TextPath 
				key={`textPath-${this.props.name}`}
				{...this.props}
				ref={node => {
					this.textPathNode = node;
				}}
				draggable
				onDragEnd={() => this.props.onUpdateNode(this.textPathNode)}
				data={path}
			/>
		];
		if (gradientData && gradientData.gradientPointsOnFocus) {
			shapes.push(<GradientShapes {...this.props} />);
		}
		return shapes;
	}
}