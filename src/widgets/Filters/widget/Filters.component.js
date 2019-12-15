import React from 'react';
import FiltersMainView from './components/Filters.mainView';

export default class FiltersComponent extends React.Component {



	render() {
		return (
			<FiltersMainView {...this.props} />
		);
	}
}
