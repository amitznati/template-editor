import BaseApi from '../../../sdk/BaseApi';
import selectors from './EditTemplateMainViewSelectors';
import arrayMove from 'array-move';
import {getPX} from '../../../sdk/utils';

export const VisibilityFilters = {
	SHOW_ALL: 'SHOW_ALL',
	SHOW_COMPLETED: 'SHOW_COMPLETED',
	SHOW_ACTIVE: 'SHOW_ACTIVE'
};

export const ActionTypes = {
	UPDATE_SELECTED_LAYOUT: 'UPDATE_SELECTED_LAYOUT',
	UPDATE_TEMPLATE: 'UPDATE_TEMPLATE',
	TOGGLE_ADD_LAYOUT_DIALOG: 'TOGGLE_ADD_LAYOUT_DIALOG',
	EDIT_LAYOUT_END: 'EDIT_LAYOUT_END',
	TOGGLE_SVG_PATH_BUILDER_OPEN: 'TOGGLE_SVG_PATH_BUILDER_OPEN',
	UPDATE_SCALE: 'UPDATE_SCALE',
	SET_ALL_FONTS_LOADED: 'SET_ALL_FONTS_LOADED'
};
const defaultPosition = {
	x: 5, y: 10, transform: {}
};

const defaultFontProps = {
	fontSize: 160, fontFamily: 'Raleway',fontStyle: 'normal', fontWeight: '300'
};

const layoutsTemplate = (type,payload) => {
	switch(type) {
	case 'image':
		return {
			type: 'image',
			properties: {
				src: payload.url,
				x:8,y:8,height: 5,width:5, rotation: 0, scaleX: 1, scaleY: 1
			}
		};
	case 'text':
		return {
			type: 'text',
			properties: {
				text: payload,
				...defaultPosition,
				...defaultFontProps,
				strokeWidth: 0, stroke: '',
				fill: {fill: 'black'},
				filters: []

			}
		};
	case 'textPath': {
		const x = getPX(5);
		const y = getPX(10);
		return {
			type: 'textPath',
			properties: {
				text: payload,
				x: 5, y: 10, transform: {},
				...defaultFontProps,
				fill: {fill: 'black'}, strokeWidth: 0, stroke: '',
				pathData: {path: `M ${x} ${y} L ${x + 400} ${y}`, points: [{x, y}, {x: x + 400, y}], closePath: false},
				filters: []
			}
		};
	}
	default:
		return '';
	}
};

export default class EditTemplateMainViewApi extends BaseApi {

	updateTemplate = (template) => {
		this.dispatchStoreAction({
			type: ActionTypes.UPDATE_TEMPLATE,
			payload: template
		});
	};

	toggleAddLayoutDialog = (isOpen) => {
		this.dispatchStoreAction({
			type: ActionTypes.TOGGLE_ADD_LAYOUT_DIALOG,
			payload: !!isOpen
		});
	};

	onLayoutClick = (index) => {
		const {layouts} = this.getTemplateSelector();
		this.dispatchStoreAction({
			type: ActionTypes.UPDATE_SELECTED_LAYOUT,
			payload: {selectedLayout: layouts[index], selectedLayoutIndex: index}
		});
	};

	onDeleteLayout = (index) => {
		const template = this.getTemplateSelector();
		template.layouts.splice(index,1);
		this.updateTemplate(template);
	};

	onSortEnd = ({oldIndex, newIndex}) => {
		const template = this.getTemplateSelector();
		const newLayouts = arrayMove(template.layouts, oldIndex, newIndex);
		template.layouts = newLayouts;
		this.updateTemplate(template);
	};

	handleAddClose = ({type,value}) => {
		if(!type) {
			this.toggleAddLayoutDialog(false);
			return;
		}
		const template = this.getTemplateSelector();
		template.layouts.push(layoutsTemplate(type,value));
		this.toggleAddLayoutDialog(false);
		this.updateTemplate(template);
	};

	onUpdateLayout = (layout) => {
		const template = this.getTemplateSelector();
		let {selectedLayoutIndex} = this.getSelectedLayoutSelector();
		template.layouts[selectedLayoutIndex] = layout;
		this.updateTemplate(template);
	};

	saveTemplate = () => {
		//mockService('templates','create',this.state.template);
	};

	onEditLayoutEnd = () => {
		this.dispatchStoreAction({
			type: ActionTypes.EDIT_LAYOUT_END
		});
	};

	getAllFonts = () => {
		const template = this.getTemplateSelector();
		const {layouts = []} = template;
		const allFonts = [];
		layouts.forEach(l => {
			const {fontFamily, fontStyle, fontWeight} = l.properties;
			if (l.type === 'text' || l.type === 'textPath') {
				allFonts.push(`${fontFamily}:${fontWeight || 300}${fontStyle || 'normal'}`);
			}
		});
		if (allFonts.length === 0) {
			this.setAllFontsLoaded();
		}
		return allFonts;
	};

	onTogglePathBuilder = () => {
		this.dispatchStoreAction({
			type: ActionTypes.TOGGLE_SVG_PATH_BUILDER_OPEN
		});
	};

	updateScale = (scale) => {
		this.dispatchStoreAction({
			type: ActionTypes.UPDATE_SCALE,
			payload: scale
		});
	};

	setAllFontsLoaded = () => {
		this.dispatchStoreAction({
			type: ActionTypes.SET_ALL_FONTS_LOADED,
		});
	};


	getTemplateSelector = () => {
		return selectors.getTemplateSelector(this.store.getState());
	};

	getSelectedLayoutSelector = () => {
		return selectors.getSelectedLayoutSelector(this.store.getState());
	};

	getIsSVGPathBuilderOpenSelector = () => {
		return selectors.getIsSVGPathBuilderOpenSelector(this.store.getState());
	};

	getProductSelector = () => {
		return selectors.getProductSelector(this.store.getState());
	};

	getScaleSelector = () => {
		return selectors.getScaleSelector(this.store.getState());
	};

	isAddLayoutDialogOpenSelector = () => {
		return selectors.isAddLayoutDialogOpenSelector(this.store.getState());
	};

	isAllFontLoadedSelector = () => {
		return selectors.isAllFontLoadedSelector(this.store.getState());
	}
}
