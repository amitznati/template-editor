import React from 'react';

export default function Shape({ layout, index, previewOnly }) {
  const TagName = layout.tagName;
  return (
    <TagName
      key={`${layout.tagName}-${index}`}
      {...layout.properties}
      className={previewOnly ? '' : 'drag-svg'}
    />
  );
}
