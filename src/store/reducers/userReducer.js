export default function reducer(state={
    user: {},
    fetching: false,
    fetched: false,
    error: null,
  }, action) {

    switch (action.type) {
      case "FETCH_USER": {
        console.log('fetch user')
        return {...state, fetching: true}
      }
      case "FETCH_USER_REJECTED": {
        return {...state, fetching: false, error: action.payload}
      }
      case "FETCH_USER_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          user: action.payload,
        }
      }
      case "SET_USER": {
        return {
          ...state,
          user: {...state.user, ...action.payload},
        }
      }

    }

    return state
}
