import React from 'react';
import {getPX} from '../../../../sdk/utils';
import {SVGPathBuilder} from '../../../core';

export default function PathBuilder(props) {
	const {scale, product, selectedLayout, onPathChange} = props;
	const {pathData, x, y} = selectedLayout && selectedLayout.properties;
	let initialPoints = [
		{x: getPX(x), y: getPX(y)}, {x: getPX(x) + 200, y: getPX(y)}
	];
	if (pathData && pathData.points) {
		initialPoints = pathData.points;
	}
	const w = getPX(product.templateFrame.width, scale);
	const h = getPX(product.templateFrame.height, scale);
	return (
		<SVGPathBuilder
			onChange={onPathChange}
			{...{w, h}}
			layout={selectedLayout}
			initialPoints={initialPoints}
			gridSize={product.templateFrame.width}
			scale={scale}
		/>
	);

}
