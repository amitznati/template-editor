import React, { Component } from 'react';
import PropTypes from 'prop-types';
import General from './General';
import Path from './Path';
import Point from './Point';

// import './styles.css';

class Controls extends Component {
  static propTypes = {
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
    grid: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    points: PropTypes.array.isRequired,
    activePoint: PropTypes.number.isRequired,
    closePath: PropTypes.bool.isRequired,
    fillPath: PropTypes.bool.isRequired,
    setQuadraticPosition: PropTypes.func.isRequired,
    setQuadraticT: PropTypes.func.isRequired,
    setCubicPosition: PropTypes.func.isRequired,
    setCubicS: PropTypes.func.isRequired,
    setArcParam: PropTypes.func.isRequired,
    setWidth: PropTypes.func.isRequired,
    setHeight: PropTypes.func.isRequired,
    setClosePath: PropTypes.func.isRequired,
    setFillPath: PropTypes.func.isRequired,
    setGridSize: PropTypes.func.isRequired,
    setGridSnap: PropTypes.func.isRequired,
    setGridShow: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    setPointType: PropTypes.func.isRequired,
    setPointPosition: PropTypes.func.isRequired,
    removeActivePoint: PropTypes.func.isRequired
  };

  render() {
    const {
      w,
      h,
      grid,
      path,
      closePath,
      fillPath,
      points,
      activePoint,
      setWidth,
      setHeight,
      setGridSize,
      setGridSnap,
      setGridShow,
      setClosePath,
      setFillPath,
      reset,
      setPointType,
      setPointPosition,
      setQuadraticPosition,
      setQuadraticT,
      setCubicPosition,
      setCubicS,
      setArcParam,
      removeActivePoint
    } = this.props;

    return (
      <div className='ad-Controls'>
        <General
          w={w}
          h={h}
          grid={grid}
          setWidth={setWidth}
          setHeight={setHeight}
          setGridSize={setGridSize}
          setGridSnap={setGridSnap}
          setGridShow={setGridShow}
        />

        <Path
          path={path}
          closePath={closePath}
          fillPath={fillPath}
          setClosePath={setClosePath}
          setFillPath={setFillPath}
          reset={reset}
        />

        <Point
          w={w}
          h={h}
          grid={grid}
          points={points}
          activePoint={activePoint}
          setPointType={setPointType}
          setPointPosition={setPointPosition}
          setQuadraticPosition={setQuadraticPosition}
          setQuadraticT={setQuadraticT}
          setCubicPosition={setCubicPosition}
          setCubicS={setCubicS}
          setArcParam={setArcParam}
          removeActivePoint={removeActivePoint}
        />
      </div>
    );
  }
}

export default Controls;
