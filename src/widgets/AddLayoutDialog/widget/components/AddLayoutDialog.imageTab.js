import React from 'react';
import {Button, label} from '@material-ui/core';

export default function ImageTab({onSelect}) {
	const [inputImage, setInputImage] = React.useState('');

	const handleChange = (event) => {
		setInputImage(URL.createObjectURL(event.target.files[0]));
	};

	return (
		<div>
			<input
				accept="image/*"
				id="contained-button-file"
				type="file"
				style={{display: 'none'}}
				onChange={handleChange}
			/>
			<label htmlFor="contained-button-file">
				<Button variant="contained" color="primary" component="span">
					Upload
				</Button>
			</label>
			{inputImage && <img src={inputImage} alt="input file" />}
			<Button color="primary" disabled={!inputImage} onClick={() => onSelect({type: 'image', value: {url: inputImage}})}>ADD</Button>
		</div>
	);

}
