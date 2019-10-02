import React from 'react';
import PropTypes from 'prop-types';
import { Image, useStrictMode } from 'react-konva';

useStrictMode(true);
export default class URLImage extends React.Component {
	static propTypes = {
		src: PropTypes.string,
		// x: PropTypes.number,
		// y: PropTypes.number,
		// width: PropTypes.number,
		// height: PropTypes.number,
		// rotation: PropTypes.number,
		// name: PropTypes.string,
		onUpdateNode: PropTypes.func
	}
	state = {
		image: null
	};
	componentDidMount() {
		this.loadImage();
	}
	componentDidUpdate(oldProps) {
		if (oldProps.src !== this.props.src) {
			this.loadImage();
		}
	}
	componentWillUnmount() {
		this.image.removeEventListener('load', this.handleLoad);
	}
	loadImage() {
		// save to "this" to remove "load" handler on unmount
		this.image = new window.Image();
		this.image.src = this.props.src;
		this.image.addEventListener('load', this.handleLoad);
	}
	handleLoad = () => {
		// after setState react-konva will update canvas and redraw the layer
		// because "image" property is changed
		this.setState({
			image: this.image
		});
		// if you keep same image object during source updates
		// you will have to update layer manually:
		// this.imageNode.getLayer().batchDraw();
	};
	render() {
		return (
			<Image
				{...this.props}
				image={this.state.image}
				ref={node => {
					this.imageNode = node;
				}}
				draggable
				onDragEnd={() => this.props.onUpdateNode(this.imageNode)}
			/>
		);
	}
}