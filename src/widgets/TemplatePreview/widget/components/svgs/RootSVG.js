import React from 'react';
import PropTypes from 'prop-types';
import subjx from './subjx/js';
import './subjx/style/subjx.css';
import { getCM } from '../../../../../sdk/utils';

const svgOptions = (methods, scale, proportions) => {
  const options = {
    container: '#svg-container',
    // restrict: '#svg-container',
    proportions,
    // rotationPoint: true,
    themeColor: 'purple',
    // each: {
    // 	//move: true,
    // 	//rotate: true
    // },
    snap: {
      x: 0,
      y: 0,
      angle: 1
    },
    scale,
    cursorMove: 'move',
    cursorRotate: 'crosshair',
    cursorResize: 'pointer',
    ...methods
  };
  return options;
};

class DesignCanvas extends React.Component {
  shiftPress = false;

  getActiveNode = () => {
    const { selectedLayoutIndex } = this.props;
    let node;
    React.Children.map(this.props.children, (element) => {
      if (
        !element.props['data-logo-index'] &&
        element.props['data-layout-index'] === selectedLayoutIndex
      ) {
        node = element.ref.current;
      }
    });
    return node;
  };

  refreshNode = () => {
    const { setIsNodeRefreshRequire } = this.props;
    this.currentLayout && this.currentLayout.disable();
    const node = this.getActiveNode();
    this.currentLayout =
      node &&
      subjx(node).drag(
        svgOptions(this.methods, this.props.scale, this.shiftPress)
      )[0];
    setIsNodeRefreshRequire(false);
  };

  getPropertiesFromActiveNode = (el) => {
    if (!el) return {};
    const x = el.getAttribute('x');
    const y = el.getAttribute('y');
    const matrix =
      el.transform && el.transform.baseVal[0] && el.transform.baseVal[0].matrix;
    const { a, b, c, d, e, f } = matrix;
    const transform = matrix
      ? {
          scaleX: a.toFixed(3),
          skewX: b.toFixed(3),
          skewY: c.toFixed(3),
          scaleY: d.toFixed(3),
          translateX: e.toFixed(3),
          translateY: f.toFixed(3)
        }
      : {};
    return {
      x: x ? getCM(x) : 0,
      y: y ? getCM(y) : 0,
      transform
    };
  };

  methods = {
    onDrop: (e, el) => {
      const newValues = this.getPropertiesFromActiveNode(el);
      this.refreshNode();
      this.updateNode(newValues);
    }
  };

  updateNode = (newValues) => {
    const { selectedLayout, onUpdateLayout } = this.props;
    const { alignment } = selectedLayout.properties;
    const newAlignment = { ...alignment };
    if (newAlignment.vertical) {
      newAlignment.vertical.align = false;
    }
    if (newAlignment.horizontal) {
      newAlignment.horizontal.align = false;
    }
    selectedLayout.properties = {
      ...selectedLayout.properties,
      alignment: newAlignment,
      ...newValues
    };
    onUpdateLayout && onUpdateLayout(selectedLayout);
  };

  handleStageMouseDown = (e) => {
    // clicked on stage - cler selection
    if (e.target.id === 'svg-container') {
      this.props.onEditLayoutEnd();
      this.currentLayout && this.currentLayout.disable();
      return;
    }
    if (e.target.classList.contains('sjx-drag')) return;
    // this.currentLayout && this.currentLayout.disable();
    // this.currentLayout = subjx(e.target).drag(svgOptions(this.methods))[0];
    const layoutIndex = Number(e.target.getAttribute('data-layout-index'));
    const logoIndex = e.target.getAttribute('data-logo-index');
    if (logoIndex || logoIndex === 0 || logoIndex === '0') {
      this.props.onLayoutClick(Number(logoIndex));
    } else {
      this.props.onLayoutClick(layoutIndex);
    }
  };

  handleShiftPress = (event) => {
    if (
      (event.code === 'ShiftLeft' || event.code === 'ShiftRight') &&
      !this.shiftPress
    ) {
      this.shiftPress = true;
      this.refreshNode();
    }
  };

  handleShiftUp = (event) => {
    if (
      (event.code === 'ShiftLeft' || event.code === 'ShiftRight') &&
      this.shiftPress
    ) {
      this.shiftPress = false;
      this.refreshNode();
    }
  };

  componentDidMount() {
    if (this.props.previewOnly) return;
    window.addEventListener('keydown', this.handleShiftPress);
    window.addEventListener('keyup', this.handleShiftUp);
    this.refreshNode();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleShiftPress);
    window.removeEventListener('keyup', this.handleShiftPress);
  }

  componentDidUpdate(prevProps) {
    if (this.props.previewOnly) return;
    const {
      selectedLayoutIndex,
      isSVGPathBuilderOpen,
      scale,
      isNodeRefreshRequire
    } = this.props;
    if (
      selectedLayoutIndex !== prevProps.selectedLayoutIndex ||
      scale !== prevProps.scale ||
      isNodeRefreshRequire
    ) {
      this.refreshNode();
    } else if (isSVGPathBuilderOpen !== prevProps.isSVGPathBuilderOpen) {
      if (isSVGPathBuilderOpen) {
        this.currentLayout && this.currentLayout.disable();
      } else {
        this.refreshNode();
      }
    }
  }

  render() {
    const { h, w, previewOnly } = this.props;
    return (
      <svg
        id={previewOnly ? '' : 'svg-container'}
        viewBox={`0 0 ${w} ${h}`}
        xmlns='http://www.w3.org/2000/svg'
        onMouseDown={previewOnly ? undefined : this.handleStageMouseDown}
      >
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
