import React, { Children } from 'react';
import subjx from './js/subjx.dev.common.js';
import './style/subjx.css';

// class ZoomContainer {

// 	constructor() {
// 		this.scale = 1;
// 	}

// 	zoom(e) {
// 		if (!e.shiftKey) return;
// 		e.preventDefault();
// 		let { scale } = this;
// 		const newScale = scale + (e.wheelDelta < 0 ? -0.25 : 0.25);
// 		scale = newScale > 2 || newScale < 0.5 ? scale : newScale;
// 		subjx(e.currentTarget).css({
// 			transform: `scale(${scale},${scale})`
// 		});
// 		this.scale = scale;
// 	}

// }

export default class Transformer extends React.Component {
	transformerRef = React.createRef();
	
	componentDidMount() {
		this.updateNode();
	}

	updateNode = () => {
		// const zoomSvg = new ZoomContainer();
		// subjx('#svg-container')
        // 	.on('mousewheel', e => {
        //     zoomSvg.zoom(e);
		// });
		const child = React.Children.only(this.props.children);
		if (!child || this.init) return;
		const ref = child.ref.current;
		// create Observable instance
		const obs = subjx.createObservable();

		const methods = {
			onInit(el) {
				//console.log('init');
			},
			onMove() {
				console.log('is moving');
			},
			onResize(dx, dy) {
				//console.log('is resizing');
			},
			onRotate(rad) {
				//console.log('is rotating');
			},
			onDrop(e, el) {
				console.log('is dropped el', el);
				console.log('is dropped e', e);
			},
			onDestroy(el) {
				console.log('is destroyed');
			}
		};
	
		const svgOptions = {
			container: '#svg-container',
			restrict: '#svg-container',
			//proportions: true,
			//rotationPoint: true,
			//themeColor: 'white',
			each: {
				//move: true,
				//rotate: true
			},
			snap: {
				x: 0,
				y: 0,
				angle: 25
			},
			cursorMove: 'move',
			cursorRotate: 'crosshair',
			cursorResize: 'pointer',
			...methods
		};
		
		const svgs = subjx(ref)
			.drag(svgOptions, obs);
		if (!svgs) return;
		svgs.forEach(item => {
			subjx(item.controls).on('dblclick', () => {
				item.disable();
			});
		});
	
		// double click activating/deactivating the drag method
		subjx(ref).on('dblclick', e => {
			if (e.currentTarget.classList.contains('sjx-drag')) return;
			const xDraggable = subjx(e.currentTarget).drag(svgOptions, obs)[0];
			// adding event to controls
			const controls = xDraggable.controls;
			subjx(controls).on('click', () => {
				xDraggable.disable();
			});
		});
		this.init = true;
	}

	componentDidUpdate() {
		this.updateNode();
	}
	render() {
		return this.props.children;
	}
}