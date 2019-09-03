
//import products from './products';
//import templates from './templates';
const data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : {};
const api = {
	products: data.products || [],
	templates: data.templates || []
};

const apis = {
	PRODUCTS: 'products',
	TEMPLATES: 'templates'
};

const methods = {
	ALL: 'ALL',
	BYID: 'BYID',
	UPDATE_OR_CREATE: 'UPDATE_OR_CREATE'
};

function getAllWithFilter(name,payload) {
	if(!payload) {
		const data = api[name];
		return data;
	}
	return [];
}

function jsonCopy(src) {
	return JSON.parse(JSON.stringify(src));
}
const saveResourceList = (name,list) => {
	data[name] = list;
	localStorage.setItem('data', JSON.stringify(data));
};

const updateResource = (resourceName, payload) => {
	let data = api[resourceName].filter(r => r.id !== payload.id);
	data.push(payload);
	saveResourceList(resourceName, data);
	return payload.id;
};

const createResource = (resourceName, body) => {
	const data = api[resourceName];
	const id = (data && data.length) ? data.reduce((crr, cur) => crr.id > cur.id) +1 : 1;
	body.id = id;
	data.push(body);
	saveResourceList(resourceName, data);
	return id;
};

const call = (resource,mothod,payload) => {
	// if(!(api[resource] && api[resource].length > 0)) {
	// 	return {};
	// }
	switch(mothod) {
	case methods.ALL:
		return getAllWithFilter(resource,payload);
	case methods.BYID:
		return jsonCopy(api[resource].find(r => r.id === Number(payload)));
	case methods.UPDATE_OR_CREATE: 
		if(payload.id) {
			return updateResource(resource,payload);
		} 
		return createResource(resource,payload);
	default:
		return {};
	}
};
const mockService = {
	apis,
	methods,
	call
};

export default mockService;