const mapComponentProps = (props) => {
  const {
    selectGradientOptions,
    selectedGradient,
    onAddGradient,
    onGradientChange,
    removeGradientFromLayout,
    removeGradientFromTemplate,
    onGradientNameChange,
    dynamicColorOptions
  } = props;
  return {
    selectedGradient,
    editGradientProps: {
      onGradientChange,
      selectedGradient,
      removeGradientFromLayout,
      onGradientNameChange,
      dynamicColorOptions
    },
    selectGradientProps: {
      selectGradientOptions,
      onAddGradient,
      removeGradientFromTemplate
    }
  };
};

export { mapComponentProps };
