export const addElement = (name) => {
    return (dispatch, getState, {getFirestore}) => {
      const firestore = getFirestore();
      const authorId = getState().firebase.auth.uid;
      firestore.collection('elements').add({
        element_name: name,
      }).then(() => {
        dispatch({ type: 'ADD_ELEMENT_SUCCESS' });
      }).catch(err => {
        dispatch({ type: 'ADD_ELEMENT_ERROR' }, err);
      });
    }
  };