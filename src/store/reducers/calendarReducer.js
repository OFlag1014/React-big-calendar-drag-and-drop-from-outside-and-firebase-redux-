const initState = {
    isAdded: false
}

const calendarReducer = (state = initState, action) => {
  switch (action.type) {
    case 'ADD_ELEMENT_SUCCESS':
      console.log('add element success');
      return {
          ...state,
          isAdded: true,
        };
    case 'ADD_ELEMENT_ERROR':
      console.log('add element error');
      return {
          ...state,
          isAdded: false,
      };
    default:
      return state;
  }
};

export default calendarReducer;