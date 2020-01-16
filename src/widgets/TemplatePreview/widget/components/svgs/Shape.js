import React from 'react';

export default function Shape({layout, index}) {
	const TagName = layout.tagName;
	return (
		<TagName key={`${layout.tagName}-${index}`} {...layout.properties} />
	);
}
