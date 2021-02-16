import React, { Component } from 'react';
import AddLayoutDialogMainView from './components/AddLayoutDialog.mainView';

export default class AddLayoutDialogComponent extends Component {
  render() {
    return <AddLayoutDialogMainView {...this.props} />;
  }
}
