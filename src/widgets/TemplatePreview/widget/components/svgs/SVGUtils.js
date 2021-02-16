import { getPX } from '../../../../../sdk/utils';

export const getGlobalLayoutProperties = ({
  layout,
  index,
  previewOnly,
  ref,
  logoIndex
}) => {
  const {
    x,
    y,
    alignment,
    transform: {
      skewY = 0,
      skewX = 0,
      scaleX = 1,
      scaleY = 1,
      translateX = 0,
      translateY = 0
    },
    filters
  } = layout.properties;
  const isForLogo = logoIndex || logoIndex === 0 || logoIndex === '0';
  const isDraggable = !previewOnly && !isForLogo;
  const layoutProperties = {
    x: getPX(x),
    y: getPX(y),
    transform: `matrix(${scaleX} ${skewX} ${skewY} ${scaleY} ${translateX} ${translateY})`,
    className: isDraggable ? 'drag-svg' : '',
    name: index,
    key: `${layout.type}_${index}`,
    id: `${layout.type}_${index}`,
    ref,
    'data-layout-index': index,
    'data-logo-index': logoIndex,
    style: { overflow: 'hidden' }
  };

  if (filters.length) {
    layoutProperties.style = {
      ...layoutProperties.style,
      filter: filters.map((f) => `url(#${f})`).join(' ')
    };
  }
  if (alignment && ['text', 'textPath'].includes(layout.type)) {
    if (alignment.vertical) {
      layoutProperties.dominantBaseline =
        alignment.vertical.alignmentAttributes;
    }
    if (alignment.horizontal) {
      layoutProperties.textAnchor = alignment.horizontal.alignmentAttributes;
    }
  }
  return layoutProperties;
};
