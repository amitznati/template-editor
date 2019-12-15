import React, {Component} from 'react';
import EditTemplateMainViewMainView from './components/EditTemplateMainView.mainView';

export default class LayoutListComponent extends Component {

	render() {
		return (
			<EditTemplateMainViewMainView {...this.props} />
		);
	}

}
