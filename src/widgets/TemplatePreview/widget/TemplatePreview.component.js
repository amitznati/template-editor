import React, { Component } from 'react';
import TemplatePreviewMainView from './components/TemplatePreview.mainView';
import { mapComponentProps } from './TemplatePreview.propsMappar';
export default class TemplatePreviewComponent extends Component {
  render() {
    const props = mapComponentProps(this.props);
    return <TemplatePreviewMainView {...props} />;
  }
}
