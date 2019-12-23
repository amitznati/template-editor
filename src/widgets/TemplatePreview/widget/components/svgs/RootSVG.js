
import React from 'react';
import PropTypes from 'prop-types';
import subjx from './subjx/js';
import './subjx/style/subjx.css';
import {getCM} from './../../../../../sdk/utils';

const svgOptions = (methods) => {
	const options = {
		container: '#svg-container',
		//restrict: '#svg-container',
		//proportions: true,
		//rotationPoint: true,
		themeColor: 'purple',
		// each: {
		// 	//move: true,
		// 	//rotate: true
		// },
		// snap: {
		// 	x: 0,
		// 	y: 0,
		// 	angle: 1
		// },
		cursorMove: 'move',
		cursorRotate: 'crosshair',
		cursorResize: 'pointer',
		...methods
	};
	return options;
};


class DesignCanvas extends React.Component {
	getActiveNode = () => {
		const {selectedLayoutIndex} = this.props;
		let node = undefined;
		React.Children.map(this.props.children, (element) => {
			if (element.props.layoutindex === selectedLayoutIndex) {
				node = element.ref.current;
			}
		});
		return node;
	};

	getPropertiesFromActiveNode = (el) => {
		if (!el) return {};
		const x = el.getAttribute('x');
		const y = el.getAttribute('y');
		const matrix = el.transform && el.transform.baseVal[0] && el.transform.baseVal[0].matrix;
		const {a,b,c,d,e,f} = matrix;
		const transform = matrix ? {scaleX: a.toFixed(3), skewX: b.toFixed(3), skewY: c.toFixed(3), scaleY: d.toFixed(3), translateX: e.toFixed(3), translateY: f.toFixed(3)}: {};
		return {
			x: x ? getCM(x) : 0,
			y: y ? getCM(y) : 0,
			transform
		};
	};

	methods = {
		onDrop: (e, el) => {
			const newVals = this.getPropertiesFromActiveNode(el);
			this.updateNode(newVals);
		},
	};



	updateNode = (newVals) => {
		const {selectedLayout, onUpdateLayout} = this.props;
		selectedLayout.properties = {
			...selectedLayout.properties,
			...newVals
		};
		onUpdateLayout && onUpdateLayout(selectedLayout);
	};

	handleStageMouseDown = e => {
		// clicked on stage - cler selection
		if ('svg-container' === e.target.id) {
			this.props.onEditLayoutEnd();
			this.currentLayout && this.currentLayout.disable();
			return;
		}
		if (e.target.classList.contains('sjx-drag')) return;
		// this.currentLayout && this.currentLayout.disable();
		// this.currentLayout = subjx(e.target).drag(svgOptions(this.methods))[0];
		this.props.onLayoutClick(Number(e.target.getAttribute('name')));
	};

	componentDidUpdate(prevProps) {
		const {selectedLayoutIndex, isSVGPathBuilderOpen} = this.props;
		if (selectedLayoutIndex !== prevProps.selectedLayoutIndex) {
			this.currentLayout && this.currentLayout.disable();
			const node = this.getActiveNode();
			this.currentLayout = node && subjx(node).drag(svgOptions(this.methods))[0];
		} else if (isSVGPathBuilderOpen !== prevProps.isSVGPathBuilderOpen) {
			if (isSVGPathBuilderOpen) {
				this.currentLayout && this.currentLayout.disable();
			} else {
				const node = this.getActiveNode();
				this.currentLayout = node && subjx(node).drag(svgOptions(this.methods))[0];
			}
		}
	}

	render() {
		const {h, w} = this.props;
		return (
			<svg id="svg-container"
				viewBox={`0 0 ${w} ${h}`}
				xmlns="http://www.w3.org/2000/svg"
				onMouseDown={this.handleStageMouseDown}>
				{this.props.children}
			</svg>
		);
	}
}

DesignCanvas.propTypes = {
	children: PropTypes.array,
	onUpdateLayout: PropTypes.func,
	onLayoutClick: PropTypes.func,
	onEditLayoutEnd: PropTypes.func,
	selectedLayoutIndex: PropTypes.any,
	h: PropTypes.number,
	w: PropTypes.number,
	scale: PropTypes.number,
	selectedLayout: PropTypes.object || undefined,
	isSVGPathBuilderOpen: PropTypes.bool
};

export default DesignCanvas;
