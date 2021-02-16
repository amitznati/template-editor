import React, { Component } from 'react';
import EditTemplateMainViewMainView from './components/EditTemplateMainView.mainView';

export default class EditTemplateComponent extends Component {
  componentDidMount() {
    const { setInitialData, initialData } = this.props;
    setInitialData(initialData);
  }

  render() {
    return <EditTemplateMainViewMainView {...this.props} />;
  }
}
