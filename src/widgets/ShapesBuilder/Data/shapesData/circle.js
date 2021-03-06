export default {
	id: 'circle',
	inputData: {
		cx: {type: 'number'},
		cy: {type: 'number'},
		r: {type: 'number'}
	},
	layout: {
		type: 'shape',
		tagName: 'circle',
		properties: {
			cx: 100, cy: 100, r: 50,
		}
	}
};
