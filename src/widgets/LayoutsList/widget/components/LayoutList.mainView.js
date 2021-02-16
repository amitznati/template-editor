import React from 'react';
import LayoutListOpen from './layoutListOpen';
import LayoutsListClose from './LayoutsListClose';

function LayoutListMainView(props) {
  const {
    isSVGPathBuilderOpen,
    selectedLayout,
    layouts,
    onBack,
    onUpdateLayout,
    onTogglePathBuilder,
    onDeleteLayout,
    onLayoutClick,
    onSortEnd,
    setIgnoreLayout,
    onDuplicateLayout,
    dynamicTextOptions,
    uploadedFonts,
    onAlignmentClick,
    onFullSizeClick,
    googleFontAPIKey
  } = props;
  return (
    <div>
      {!selectedLayout && (
        <LayoutsListClose
          onSortEnd={onSortEnd}
          layouts={layouts}
          onLayoutClick={onLayoutClick}
          onDeleteLayout={onDeleteLayout}
          setIgnoreLayout={setIgnoreLayout}
          onDuplicateLayout={onDuplicateLayout}
        />
      )}
      {selectedLayout && (
        <LayoutListOpen
          layout={selectedLayout}
          onUpdate={onUpdateLayout}
          {...{
            isSVGPathBuilderOpen,
            dynamicTextOptions,
            uploadedFonts,
            onTogglePathBuilder,
            onBack,
            onAlignmentClick,
            onFullSizeClick,
            googleFontAPIKey
          }}
        />
      )}
    </div>
  );
}

export default LayoutListMainView;
