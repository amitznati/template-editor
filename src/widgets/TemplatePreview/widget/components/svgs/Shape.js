import React from 'react';
import cx from 'classnames';

export default function Shape({layout, index}) {
	const TagName = layout.tagName;
	return (
		<TagName
			key={`${layout.tagName}-${index}`}
			{...layout.properties}
			className={cx('drag-svg')}
		/>
	);
}
