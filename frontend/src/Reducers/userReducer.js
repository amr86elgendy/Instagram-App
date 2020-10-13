export const initState = {_id: '', name: '', email: '', followers: [], following: []};


export const userReducer = (state, action) => {
  switch (action.type) {
    case 'USER':
      return action.payload

    case 'LOGOUT':
      return null

    case 'UPDATE':
      return action.payload

    case 'UPDATE_PHOTO':
      return action.payload

    default:
      return state;
  }
}