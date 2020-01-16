import { connect } from 'react-redux';
import {getInstance} from 'sdk';
import ShapesBuilderComponent from './ShapesBuilder.component';

const shapesBuilderApi = getInstance().ShapesBuilderApi;

const mapStateToProps = () => {
	return {
		data: shapesBuilderApi.getDataSelector()
	};
};

const mapDispatchToProps = () => ({
	updateData: shapesBuilderApi.updateData
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ShapesBuilderComponent);
