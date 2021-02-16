import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Drawer } from '@material-ui/core';

import { positive, rangeGrid } from './utils/maths';
import { L, Q, C, A } from './utils/points';
import { getPath } from './utils/path';

import SVG from './SVG';
import Controls from './Controls';

import './Builder/styles.css';

class SVGPathBuilder extends Component {
  static propTypes = {
    initialPoints: PropTypes.array.isRequired,
    h: PropTypes.number.isRequired,
    w: PropTypes.number.isRequired,
    gridSize: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    layout: PropTypes.object.isRequired,
    scale: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.svg = React.createRef();
    SVGElement.prototype.getTransformToElement =
      SVGElement.prototype.getTransformToElement ||
      function (toElement) {
        return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
      };
    this.state = {
      ctrl: false,
      activePoint: 0,
      isDragging: false,
      fillPath: false,
      grid: {
        show: true,
        snap: false,
        size: props.gridSize
      },
      points: props.initialPoints,
      closePath: props.closePath,
      path: this.handlePathChange(props.initialPoints, props.closePath)
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
    document.addEventListener('keyup', this.handleKeyUp, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
    document.removeEventListener('keyup', this.handleKeyUp, false);
  }

  handleChange = (newValues) => {
    this.setState(newValues);
  };

  handlePathChange = (points, closePath) => {
    const { onChange } = this.props;
    const path = getPath(points, closePath);
    if (onChange) {
      onChange({ points, path, closePath });
    }
    return path;
  };

  handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      this.handleChange({ ctrl: true });
    }
  };

  handleKeyUp = (e) => {
    if (!e.ctrlKey && !e.metaKey) {
      this.handleChange({ ctrl: false });
    }
  };

  /**
   * SVG document parameters
   */
  setWidth = (e) => {
    let v = positive(e.target.value);
    const min = 1;

    if (v < min) {
      v = min;
    }

    this.handleChange({ w: v });
  };

  setHeight = (e) => {
    let v = positive(e.target.value);
    const min = 1;

    if (v < min) {
      v = min;
    }

    this.handleChange({ h: v });
  };

  /**
   * Path parameters
   */
  setClosePath = (e) => {
    const { points } = this.state;
    const closePath = e.target.checked;

    this.handleChange({
      closePath,
      path: this.handlePathChange(points, closePath)
    });
  };

  setFillPath = (e) => {
    this.handleChange({ fillPath: e.target.checked });
  };

  /**
   * Grid parameters
   */
  setGridSize = (e) => {
    const grid = this.state.grid;

    grid.size = rangeGrid(
      positive(e.target.value),
      1,
      Math.min(this.props.w, this.props.h)
    );

    this.handleChange({ grid });
  };

  setGridSnap = (e) => {
    const grid = this.state.grid;

    grid.snap = e.target.checked;

    this.handleChange({ grid });
  };

  setGridShow = (e) => {
    const grid = this.state.grid;

    grid.show = e.target.checked;

    this.handleChange({ grid });
  };

  cursorPoint = (evt) => {
    const svg = this.svg.current;
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const loc = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: loc.x, y: loc.y };
  };

  getMouseCoords = (e, dragData) => {
    if (!dragData) return;
    const { mouseStart, elementStart, element } = dragData;
    const svg = this.svg.current;
    let pt = svg.createSVGPoint();
    const current = this.cursorPoint(e);
    pt.x = current.x - mouseStart.x;
    pt.y = current.y - mouseStart.y;
    const m = element.getTransformToElement(svg).inverse();
    m.e = m.f = 0;
    pt = pt.matrixTransform(m);
    const retPoint = { x: elementStart.x + pt.x, y: elementStart.y + pt.y };
    if (this.state.grid.snap) {
      const w = this.props.w / this.props.scale;
      const spacing = w / this.state.grid.size;
      retPoint.x -= retPoint.x % spacing;
      retPoint.y -= retPoint.y % spacing;
    }
    return retPoint;
  };

  drag = (e, index, object = 'point', n = false) => {
    var mouseStart = this.cursorPoint(e);
    var elementStart = {
      x: e.target.cx.animVal.value,
      y: e.target.cy.animVal.value
    };

    if (!this.state.ctrl) {
      const newState = {
        activePoint: index,
        isDragging: { object, n, mouseStart, elementStart, element: e.target }
      };
      this.handleChange({
        ...newState
      });
    }
  };

  resetNextCurve = (points, active) => {
    if (active !== points.length - 1) {
      if (points[active + 1].quadratic) {
        points[active + 1].quadratic.t = false;
      }

      if (points[active + 1].cubic) {
        points[active + 1].cubic.s = false;
      }
    }

    return points;
  };

  /**
   * Default point values
   */
  setPointType = (e) => {
    let { points, activePoint, closePath } = this.state;

    // not the first point
    if (activePoint !== 0) {
      const v = e.target.value;

      points = this.resetNextCurve(points, activePoint);

      const p = points[activePoint];
      const _p = points[activePoint - 1];

      switch (v) {
        case 'l':
          points[activePoint] = L(p.x, p.y);
          break;

        case 'q':
          points[activePoint] = Q(p.x, p.y, (p.x + _p.x) / 2, (p.y + _p.y) / 2);
          break;

        case 'c':
          points[activePoint] = C(
            p.x,
            p.y,
            (p.x + _p.x - 50) / 2,
            (p.y + _p.y) / 2,
            (p.x + _p.x + 50) / 2,
            (p.y + _p.y) / 2
          );
          break;

        case 'a':
          points[activePoint] = A(p.x, p.y, 50, 50, 0, 1, 1);
          break;
        default:
          break;
      }

      this.handleChange({
        points,
        path: this.handlePathChange(points, closePath)
      });
    }
  };

  setPointPosition = (coord, e) => {
    const coords = this.state.points[this.state.activePoint];
    let v = positive(e.target.value);

    if (coord === 'x' && v > this.props.w) {
      v = this.props.w;
    } else if (coord === 'y' && v > this.props.h) {
      v = this.props.h;
    }

    coords[coord] = v;

    this.setPointCoords(coords);
  };

  setPointCoords = (coords) => {
    const { points, activePoint, closePath } = this.state;

    points[activePoint].x = coords.x;
    points[activePoint].y = coords.y;

    this.handleChange({
      points,
      path: this.handlePathChange(points, closePath)
    });
  };

  setQuadraticPosition = (coord, e) => {
    const coords = this.state.points[this.state.activePoint].quadratic;
    let v = positive(e.target.value);

    if (coord === 'x' && v > this.props.w) {
      v = this.props.w;
    } else if (coord === 'y' && v > this.props.h) {
      v = this.props.h;
    }

    coords[coord] = v;

    this.setQuadraticCoords(coords);
  };

  setQuadraticCoords = (coords) => {
    const { points, activePoint, closePath } = this.state;

    points[activePoint].quadratic.x = coords.x;
    points[activePoint].quadratic.y = coords.y;

    this.handleChange({
      points,
      path: this.handlePathChange(points, closePath)
    });
  };

  setQuadraticT = (e) => {
    const { points, activePoint, closePath } = this.state;

    points[activePoint].quadratic.t = e.target.checked;

    this.handleChange({
      points,
      path: this.handlePathChange(points, closePath)
    });
  };

  setCubicPosition = (coord, e) => {
    const coords = this.state.points[this.state.activePoint].cubic;
    const v = positive(e.target.value);

    if (coord === 'x1') {
      this.setCubicCoords(
        {
          x: v,
          y: coords.y1
        },
        1
      );
    }

    if (coord === 'y1') {
      this.setCubicCoords(
        {
          x: coords.x1,
          y: v
        },
        1
      );
    }

    if (coord === 'x2') {
      this.setCubicCoords(
        {
          x: v,
          y: coords.y2
        },
        2
      );
    }

    if (coord === 'y2') {
      this.setCubicCoords(
        {
          x: coords.x2,
          y: v
        },
        2
      );
    }
  };

  setCubicCoords = (coords, n) => {
    const { points, activePoint, closePath } = this.state;

    if (n === 1) {
      points[activePoint].cubic.x1 = coords.x;
      points[activePoint].cubic.y1 = coords.y;
    }

    if (n === 2) {
      points[activePoint].cubic.x2 = coords.x;
      points[activePoint].cubic.y2 = coords.y;
    }

    this.handleChange({
      points,
      path: this.handlePathChange(points, closePath)
    });
  };

  setCubicS = (e) => {
    const { points, activePoint, closePath } = this.state;

    points[activePoint].cubic.s = e.target.checked;

    this.handleChange({
      points,
      path: this.handlePathChange(points, closePath)
    });
  };

  setArcParam = (param, e) => {
    const { points, activePoint, closePath } = this.state;

    let v;

    if (['laf', 'sf'].indexOf(param) > -1) {
      v = e.target.checked ? 1 : 0;
    } else {
      v = positive(e.target.value);
    }

    points[activePoint].arc[param] = v;

    this.handleChange({
      points,
      path: this.handlePathChange(points, closePath)
    });
  };

  cancelDragging = () => {
    this.handleChange({ isDragging: false });
  };

  addPoint = (e) => {
    if (this.state.ctrl) {
      const coords = this.cursorPoint(e);
      const { points, closePath } = this.state;

      points.push(coords);

      const path = this.handlePathChange(points, closePath);
      const newState = {
        points,
        path,
        activePoint: points.length - 1
      };

      this.handleChange({
        ...newState
      });
    }
  };

  removeActivePoint = () => {
    let { points, activePoint, closePath } = this.state;

    if (points.length > 1 && activePoint !== 0) {
      points = this.resetNextCurve(points, activePoint);
      points.splice(activePoint, 1);

      this.handleChange({
        points,
        path: this.handlePathChange(points, closePath),
        activePoint: points.length - 1
      });
    }
  };

  handleMouseMove = (e) => {
    if (!this.state.ctrl) {
      const { isDragging } = this.state;
      const { object, n } = this.state.isDragging;

      switch (object) {
        case 'point':
          this.setPointCoords(this.getMouseCoords(e, isDragging));
          break;

        case 'quadratic':
          this.setQuadraticCoords(this.getMouseCoords(e, isDragging));
          break;

        case 'cubic':
          this.setCubicCoords(this.getMouseCoords(e, isDragging), n);
          break;
        default:
          break;
      }
    }
  };

  reset = () => {
    const { w, h } = this.state;
    const points = [{ x: w / 2, y: h / 2 }];
    const closePath = false;
    const path = this.handlePathChange(points, closePath);

    this.handleChange({
      points,
      path,
      closePath,
      activePoint: 0
    });
  };

  render() {
    if (!this.state.path) return null;
    return (
      <div className='ad-Builder--' onMouseUp={this.cancelDragging}>
        <SVG
          propRef={this.svg}
          {...this.state}
          w={this.props.w / this.props.scale}
          h={this.props.h / this.props.scale}
          scale={this.props.scale}
          layout={this.props.layout}
          drag={this.drag}
          addPoint={this.addPoint}
          handleMouseMove={this.handleMouseMove}
        />

        <Drawer variant='persistent' anchor='right' open>
          <div className='ad-Builder-controls'>
            <Controls
              {...this.state}
              w={this.props.w}
              h={this.props.h}
              reset={this.reset}
              removeActivePoint={this.removeActivePoint}
              setPointPosition={this.setPointPosition}
              setQuadraticPosition={this.setQuadraticPosition}
              setQuadraticT={this.setQuadraticT}
              setCubicPosition={this.setCubicPosition}
              setCubicS={this.setCubicS}
              setArcParam={this.setArcParam}
              setPointType={this.setPointType}
              setWidth={this.setWidth}
              setHeight={this.setHeight}
              setGridSize={this.setGridSize}
              setGridSnap={this.setGridSnap}
              setGridShow={this.setGridShow}
              setClosePath={this.setClosePath}
              setFillPath={this.setFillPath}
            />
          </div>
        </Drawer>
      </div>
    );
  }
}

export default SVGPathBuilder;
