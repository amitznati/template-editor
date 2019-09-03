

function jsonCopy(src) {
	return JSON.parse(JSON.stringify(src));
}
const TEMPLATE = {
	layouts: [
		{
			type: 'image',
			properties: {
				src: 'https://via.placeholder.com/600/56a8c2',
				height: 8,
				width: 8,
				x: 0,
				y: 0
			}
		},
	]
};

const PRODUCT = {
	name: '',
	image: '',
	productSize: {
		height: 0,
		width: 0
	},
	templateFrame: {
		height: 0,width: 0, x: 0, y: 0
	}
};

const CATEGORY = {
	name: 'Food & Restorants',
};

const KIT = {
	categoryId: undefined,
	name: '',
	inputAttributes: [],
};

const THEME = {
	name: '',
	kitId: undefined,
	photos: [],
	templates: []
};



const LOGO = {
	kitId: undefined,
	templateId: undefined
};

const ResourceTemplates = {
	CATEGORY: jsonCopy(CATEGORY),
	KIT: jsonCopy(KIT),
	THEME: jsonCopy(THEME),
	PRODUCT: jsonCopy(PRODUCT),
	TEMPLATE: jsonCopy(TEMPLATE),
	LOGO: jsonCopy(LOGO),
};

export default ResourceTemplates;