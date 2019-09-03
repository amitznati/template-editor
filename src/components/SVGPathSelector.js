import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Button} from '@material-ui/core';

class SVGPathSelector extends React.Component {

	render() {
		const {path, toggleOpen} = this.props;
		return (
			<div>
				<Typography variant="subtitle1">Path: {path}</Typography>
				<br />
				<Button variant="outlined" color="primary" onClick={toggleOpen}>
					Open path dialog
				</Button>
			</div>
		);
	}
}

SVGPathSelector.propTypes = {
	path: PropTypes.string,
	toggleOpen: PropTypes.func
};

export default SVGPathSelector;