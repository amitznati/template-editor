import React from 'react';

const filterTags = {
	blend: 'feBland',
	blur: 'feGaussianBlur',
	colormatrix: 'feColorMatrix',
	componentTransfer: 'feComponentTransfer',
	convolveMatrix: 'feConvolveMatrix',
	composite: 'feComposite',
	diffuseLighting: 'feDiffuseLighting',
	displacementMap: 'feDisplacementMap',
	distantLight: 'feDistantLight',
	dropShadow: 'feDropShadow',
	flood: 'feFlood',
	funcR: 'feFuncR',
	funcG: 'feFuncG',
	funcB: 'feFuncB',
	funcA: 'feFuncA',
	image: 'feImage',
	tile: 'feTile',
	merge: 'feMerge',
	mergeNode: 'feMergeNode',
	morphology: 'feMorphology',
	offset: 'feOffset',
	pointLight: 'fePointLight',
	specularLighting: 'feSpecularLighting',
	spotLight: 'feSpotLight',
	turbulence: 'feTurbulence'
};

export default function Defs({templateFilters}) {

	const renderFilterPrimitives = primitives => {
		return primitives && primitives.map((p, i) => {
			if (p.disabled) return null;
			const TagName = filterTags[p.groupName];
			const params = {};
			Object.keys(p.params).forEach(fName => {
				if (!p.params[fName].disabled && !p.params[fName].isIgnore) {
					params[fName] = p.params[fName].value;
				}
			});
			const key = p.id || `element-${i}`;
			return (
				<TagName {...params} key={key}>
					{renderFilterPrimitives(p.children)}
				</TagName>
			);
		});
	};
	const filtersDefs = templateFilters.map(filter => {
		if (filter.isIgnore) return null;
		const filterParams = {};
		Object.keys(filter.params).forEach(paramName => {
			if (!filter.params[paramName].isIgnore) {
				filterParams[paramName] = filter.params[paramName].value;
			}
		});
		return (
			<filter key={filter.id} {...filterParams} id={filter.id}>
				{renderFilterPrimitives(filter.primitives)}
			</filter>
		);
	});
	return (
		<defs>
			{filtersDefs}
		</defs>
	);

}
