import React from 'react';
import { Provider } from 'react-redux';
import { getStoreInstance } from './sdk';
import EditTemplateMainView from './widgets/EditTemplateMainView/widget/EditTemplateMainView.connect';
import TemplatePreviewComponent from './widgets/TemplatePreview/widget/TemplatePreview.component';
import TemplatePreviewForProduct from './widgets/TemplatePreview/widget/components/TemplatePreviewForProduct';
import FontLoader from './sdk/services/fontLoader';
import TemplateEditorModal from './widgets/core/TemplateEditorModal';


const TemplateEditor = (props) => {
  const store = getStoreInstance();
  return (
    <Provider store={store}>
      <EditTemplateMainView {...props} />
    </Provider>
  );
};

const TemplatePreviewForPreview = (props) => (
  <TemplatePreviewComponent previewOnly {...props} />
);
const TemplateEditorModalWrapper = (props) => {
  const store = getStoreInstance();
  return (
    <Provider store={store}>
      <TemplateEditorModal {...props} />
    </Provider>
  );
};

export { default as FontSelect } from './widgets/core/CoreFontSelect';
export { default as CoreSlider } from './widgets/core/CoreSlider';
export { default as UploadedImageCard } from './widgets/core/UploadedImageCard';

export {
  TemplateEditor,
  TemplatePreviewForPreview,
  TemplatePreviewForProduct,
  FontLoader,
  TemplateEditorModalWrapper as TemplateEditorModal
};
