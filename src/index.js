import React from 'react';
import { Provider } from 'react-redux';
import { getStoreInstance } from './sdk';
import EditTemplateMainView from './widgets/EditTemplateMainView/widget/EditTemplateMainView.connect';
const store = getStoreInstance();

const TemplateEditor = (props) => {
  return (
    <Provider store={store}>
      <EditTemplateMainView {...props} />
    </Provider>
  );
};

export { TemplateEditor };
