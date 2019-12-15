/* eslint-disable react/prop-types */
import React from 'react';
import gsap from 'gsap';
import Draggable from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

class DraggableCircle extends React.Component {

	componentDidMount() {
		Draggable.create(`#${this.props.id}`, {
			type: 'x,y',
			bounds: `#${this.props.containerId}`,
			overshootTolerance: 0,
			onDrag: this.props.onDrag,
			onDragStart: this.props.onDragStart,
			onDragEnd: this.props.onDragEnd
			//onMove: (o) => console.log(o)
		});
	}
	
	render() {
		// eslint-disable-next-line no-unused-vars
		const {containerId, onDrag, ...rest} = this.props;
		return (
			<g {...rest}/>
		);
	}
}


export default DraggableCircle;