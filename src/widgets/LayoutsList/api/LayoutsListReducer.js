const initialState = {};
const reducer = (state = initialState, action) => {
  const newState = { ...state };
  // const payload = action && action.payload;
  const type = action && action.type;
  switch (type) {
    default:
      return newState;
  }
  // return newState;
};

export default reducer;
