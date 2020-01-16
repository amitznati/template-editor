import React, {Component} from 'react';
import GradientsMainView from './components/Gradients.mainView';
import {mapComponentProps} from './Gradients.propsMappar';
export default class GradientsComponent extends Component {

	render() {
		return (
			<GradientsMainView {...mapComponentProps(this.props)} />
		);
	}

}
