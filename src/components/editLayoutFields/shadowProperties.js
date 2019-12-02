import React from 'react';
import PropTypes from 'prop-types';

const ShadowProperties = (props) => {


	return (
		<div>hi: {props.shadowData}</div>
	);
};

ShadowProperties.propTypes = {
	shadowData: PropTypes.object
};

export default ShadowProperties;