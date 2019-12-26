import {getPX} from '../../../sdk/utils';

const mapComponentProps = (props) => {
	const {
		template = {},
		scale,
		product,
		isSVGPathBuilderOpen,
		selectedLayout,
		onEditLayoutEnd,
		selectedLayoutIndex,
		onLayoutClick,
		onUpdateLayout,
		onPathChange,
		templateFilters
	} = props;
	const {layouts = []} = template;
	return {
		layouts,
		productH: getPX(product.productSize.height, scale),
		productW: getPX(product.productSize.width, scale),
		templateH: getPX(product.templateFrame.height, scale),
		templateW: getPX(product.templateFrame.width, scale),
		templateX: getPX(product.templateFrame.x, scale),
		templateY: getPX(product.templateFrame.y, scale),
		product,
		templateFilters,
		SVGRootProps: {
			onEditLayoutEnd,
			selectedLayoutIndex,
			onLayoutClick,
			onUpdateLayout,
			h: getPX(product.templateFrame.height),
			w: getPX(product.templateFrame.width),
			scale,
			selectedLayout,
			isSVGPathBuilderOpen
		},
		PathBuilderProps: {
			scale,
			product,
			selectedLayout,
			onPathChange
		}
	};
};

export {
	mapComponentProps
};


