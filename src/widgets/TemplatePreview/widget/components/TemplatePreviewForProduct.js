import React from 'react';
import { CoreSlider } from '../../../core';
import { getPX } from '../../../../sdk/utils';

const TemplatePreviewForProduct = ({ product, initiateScale = 0.5 }) => {
  const [scale, setScale] = React.useState(initiateScale);
  const productW = getPX(product.size.width, scale);
  const productH = getPX(product.size.height, scale);
  const templateH = getPX(product.templateFrame.height, scale);
  const templateW = getPX(product.templateFrame.width, scale);
  const templateX = getPX(product.templateFrame.x, scale);
  const templateY = getPX(product.templateFrame.y, scale);
  return (
    <div>
      <CoreSlider
        label='Scale'
        value={scale}
        max={30}
        step={0.001}
        handleSliderChange={(v) => setScale(Number(Number(v).toFixed(2)))}
      />
      <div
        style={{
          height: productH,
          width: productW,
          position: 'relative',
          margin: 'auto',
          overflow: 'hidden',
          background: product.imageUrl ? '' : 'white',
          boxShadow: product.imageUrl ? 'none' : '2px 4px 4px #00000085'
        }}
      >
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt='product'
            style={{ height: productH, width: productW, position: 'absolute' }}
          />
        )}
        <div
          style={{
            height: templateH,
            width: templateW,
            position: 'absolute',
            overflow: 'hidden',
            bottom: templateY,
            left: templateX,
            backgroundColor: 'rgb(0 0 0 / 36%)'
          }}
        />
      </div>
    </div>
  );
};

export default TemplatePreviewForProduct;
