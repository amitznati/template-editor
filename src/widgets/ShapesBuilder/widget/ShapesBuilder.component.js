import React, {Component} from 'react';
import ShapesBuilderMainView from './components/ShapesBuilder.mainView';
import {mapComponentProps} from './ShapesBuilder.propsMappar';
export default class ShapesBuilderComponent extends Component {

	render() {
		return (
			<ShapesBuilderMainView {...mapComponentProps(this.props)} />
		);
	}

}
