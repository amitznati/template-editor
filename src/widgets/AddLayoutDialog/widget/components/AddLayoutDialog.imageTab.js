import React from 'react';
import {Button, Grid, Tabs, Tab} from '@material-ui/core';
import {CoreText} from '../../../core';

export default function ImageTab({onSelect}) {
	const [imageSrc, setImageSrc] = React.useState('');
	const [imageName, setImageName] = React.useState('');
	const [selectedTab, setSelectedTab] = React.useState(0);

	const handleChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			const FR= new FileReader();
			const iName = event.target.files[0].name;
			FR.addEventListener('load', (e) => {
				setImageSrc(e.target.result);
				setImageName(iName);
			});
			FR.readAsDataURL(event.target.files[0]);
		}
	};

	const handleFromUrlChange = (url) => {
		setImageName(url);
		setImageSrc(url);
	};

	return (
		<Grid container>
			<Grid item xs={12}>
				<Tabs value={selectedTab} onChange={(e, value) => setSelectedTab(value)}>
					<Tab label="Upload" />
					<Tab label="From Url"/>
				</Tabs>
			</Grid>
			{selectedTab === 0 && <Grid item xs={3}>
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
			</Grid>}
			{selectedTab === 1 && <Grid item xs={3}>
				<CoreText label="From Url:" handleChange={handleFromUrlChange} value={imageName} />
			</Grid>}
			<Grid item xs={9}>
				{imageSrc && <img src={imageSrc} alt="input file" />}
			</Grid>
			<Grid item xs={12}>
				<Button color="primary" disabled={!imageSrc} onClick={() => onSelect({type: 'image', value: {url: imageSrc}})}>ADD</Button>
			</Grid>
		</Grid>
	);

}
