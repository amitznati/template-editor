import React, {Component} from 'react';
import TemplatePreviewMainView from './components/TemplatePreview.mainView';

export default class TemplatePreviewComponent extends Component {

	render() {
		return (
			<TemplatePreviewMainView {...this.props} />
		);
	}

}
