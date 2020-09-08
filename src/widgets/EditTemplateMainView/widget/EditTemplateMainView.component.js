import React, { Component } from 'react';
import EditTemplateMainViewMainView from './components/EditTemplateMainView.mainView';

export default class EditTemplateComponent extends Component {
  constructor(props) {
    super(props);
    const { setProduct, product } = props;
    setProduct(product);
  }

  render() {
    return <EditTemplateMainViewMainView {...this.props} />;
  }
}
