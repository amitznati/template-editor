import React from 'react';
import {
	sortableContainer,
	sortableElement
} from 'react-sortable-hoc';

const SortableItem = sortableElement(({value, onItemClick}) => (
	<li style={{listStyle: 'none'}} onClick={onItemClick}>
		{value}	
	</li>
));

const SortableList = sortableContainer(({items, onItemClick}) => {
	return (
		<ul style={{listStyle: 'none', margin: 0,padding: 0}}>
			{items.map((value, index) => (
				<SortableItem key={`item-${index}`} index={index} value={value} onItemClick={() => onItemClick(index)}/>
			))}
		</ul>
	);
});

export default SortableList;