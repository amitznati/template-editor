const PATH = require('path');
module.exports = (config /*, env */) => {
	config.resolve.alias = {
		sdk: PATH.resolve(__dirname, 'src/sdk'),
		widgets: PATH.resolve(__dirname, 'src/widgets'),
		mocks: PATH.resolve(__dirname, 'src/mocks'),
		['core']: PATH.resolve(__dirname, 'src/widgets/core'),
		['add-layout-dialog']: PATH.resolve(__dirname, 'src/widgets/AddLayoutDialog'),
		['edit-template-main-view']: PATH.resolve(__dirname, 'src/widgets/EditTemplateMainView'),
		['filters']: PATH.resolve(__dirname, 'src/widgets/Filters'),
		['template-preview']: PATH.resolve(__dirname, 'src/widgets/TemplatePreview'),
		['layouts-list']: PATH.resolve(__dirname, 'src/widgets/LayoutsList'),
	};
	return config;
};
