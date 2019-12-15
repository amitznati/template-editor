import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Button, TextField} from '@material-ui/core';

function PathProperties(props) {

	const {onTogglePathBuilder, pathData, onPathChanged, isSVGPathBuilderOpen} = props;
	const path = pathData && pathData.path;
	return (
		<Grid container>
			<Grid item>
				<TextField
					id="outlined-multiline-static"
					label="Path"
					multiline
					rows="4"
					value={path}
					onChange={e => onPathChanged(e.target.value)}
					disabled={isSVGPathBuilderOpen}
					margin="normal"
					variant="outlined"
				/>
				<br />
				<Button variant="outlined" color="primary" onClick={onTogglePathBuilder}>
					toggle path builder
				</Button>
			</Grid>
		</Grid>
	);
}

PathProperties.propTypes= {
	onTogglePathBuilder: PropTypes.func,
	pathData: PropTypes.object,
	onPathChanged: PropTypes.func,
	isSVGPathBuilderOpen: PropTypes.bool
};

export default PathProperties;