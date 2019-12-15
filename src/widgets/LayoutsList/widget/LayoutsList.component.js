import React, {Component} from 'react';
import LayoutListMainView from './components/LayoutList.mainView';

export default class LayoutListComponent extends Component {

	render() {
		return (
			<LayoutListMainView {...this.props} />
		);
	}

}
