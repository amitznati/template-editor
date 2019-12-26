import React from 'react';

const filterTags = {
	blend: 'feBland',
	blur: 'feBlur',
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
		return primitives && primitives.map(p => {
			if (p.disabled) return null;
			const TagName = filterTags[p.groupName];
			const params = {};
			Object.keys(p.params).forEach(fName => {
				if (!p.params[fName].disabled) {
					params[fName] = p.params[fName].value;
				}
			});
			return (
				<TagName {...params} key={p.id}>
					{renderFilterPrimitives(p.children)}
				</TagName>
			);
		});
	};
	const filtersDefs = templateFilters.map(filter => {
		return (
			<filter key={filter.id} {...filter.params} id={filter.id}>
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
