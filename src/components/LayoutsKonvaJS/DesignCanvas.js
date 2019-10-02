
import React from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Transformer } from 'react-konva';

class TransformerComponent extends React.Component {
	static propTypes = {
		selectedShapeName: PropTypes.string,
		onUpdateNode: PropTypes.func
	}
	componentDidMount() {
		this.checkNode();
	}
	componentDidUpdate() {
		this.checkNode();
	}
	checkNode() {
		// here we need to manually attach or detach Transformer node
		const stage = this.transformer.getStage();
		const { selectedShapeName } = this.props;

		const selectedNode = stage.findOne('.' + selectedShapeName);
		// do nothing if selected node is already attached
		if (selectedNode === this.transformer.node()) {
			return;
		}

		if (selectedNode) {
			// attach to another node
			this.transformer.attachTo(selectedNode);
		} else {
			// remove transformer
			this.transformer.detach();
		}
		this.transformer.getLayer().batchDraw();
	}
	render() {
		const {rotateEnabled = true} = this.props;
		return (
			<Transformer
				onTransformEnd={(e) => this.props.onUpdateNode(e.currentTarget.node())}
				ref={node => {
					this.transformer = node;
				}}
				rotateEnabled={rotateEnabled}
			/>
		);
	}
}

export default class DesignCanvas extends React.Component {
	static propTypes = {
		children: PropTypes.array,
		onUpdateNode: PropTypes.func,
		onLayoutClick: PropTypes.func,
		onEditLayoutEnd: PropTypes.func,
		selectedLayoutIndex: PropTypes.any,
		h: PropTypes.number,
		w: PropTypes.number,
		scale: PropTypes.number
	}
	handleStageMouseDown = e => {
		// clicked on stage - cler selection
		if (e.target === e.target.getStage()) {
			this.props.onEditLayoutEnd();
			return;
		}
		// clicked on transformer - do nothing
		const clickedOnTransformer =
		e.target.getParent().className === 'Transformer';
		if (clickedOnTransformer) {
			return;
		}
	
		// find clicked rect by its name
		const name = e.target.name();
		const {onLayoutClick, onEditLayoutEnd} =this.props;
		if (name) {
			onLayoutClick && onLayoutClick(Number(name));
		} else {
			onEditLayoutEnd && onEditLayoutEnd();
		}
	};
	render() {
		const {w, h, scale, selectedLayoutIndex, onUpdateNode, selectedLayout} = this.props;
		const rotateEnabled = selectedLayout && selectedLayout.type !== 'textPath';
		return (
			<Stage
				width={w}
				height={h}
				onMouseDown={this.handleStageMouseDown}
				scaleX={scale}
				scaleY={scale}
			>
				<Layer>
					{this.props.children}
					<TransformerComponent
						selectedShapeName={`${selectedLayoutIndex}`}
						onUpdateNode={onUpdateNode}
						rotateEnabled={rotateEnabled}
					/>
				</Layer>
			</Stage>
		);
	}
}