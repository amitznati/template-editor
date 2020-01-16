
const mapComponentProps = (props) => {
	const {
		selectGradientOptions,
		selectedGradient,
		onAddGradient,
		onGradientChange,
		removeGradientFromLayout,
		removeGradientFromTemplate,
		onGradientNameChange
	} = props;
	return {
		selectedGradient,
		editGradientProps: {
			onGradientChange,
			selectedGradient,
			removeGradientFromLayout,
			onGradientNameChange
		},
		selectGradientProps: {
			selectGradientOptions,
			onAddGradient,
			removeGradientFromTemplate
		}
	};
};

export {
	mapComponentProps
};


