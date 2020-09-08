import React from 'react';
import {Button} from '@material-ui/core';
import {CoreText} from '../../../core';

export default function TextTab({onSelect}) {
	const [value, setValue] = React.useState('');
	return (
		<div>
			<CoreText label="text" handleChange={setValue} value={value}/>
			<Button variant="outlined" color="primary" onClick={() => onSelect({type: 'text', value})}>
				ADD as Text
			</Button>
			<Button variant="outlined" color="primary" onClick={() => onSelect({type: 'textPath', value})}>
				ADD as Text-Path
			</Button>
		</div>
	);

}
