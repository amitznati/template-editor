import React from 'react';
import TemplatePreviewMainView from './components/TemplatePreview.mainView';
import { mapComponentProps } from './TemplatePreview.propsMappar';

export default function TemplatePreviewComponent(props) {
  const componentProps = mapComponentProps(props);
  return <TemplatePreviewMainView {...componentProps} />;
}
