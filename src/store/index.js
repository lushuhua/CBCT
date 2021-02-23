import { applyMiddleware, createStore ,compose } from "redux"

import thunk from "redux-thunk"
import promise from "redux-promise-middleware"

import reducer from "./reducers"

//import createSagaMiddleware from 'redux-saga';
//import  rootSaga  from './sagas';
//const sagaMiddleware = createSagaMiddleware();
const middleware = applyMiddleware(promise(), thunk  )

var store;
if(window.__REDUX_DEVTOOLS_EXTENSION__){
      store = createStore(reducer, compose(middleware ,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() ))
}else {
      store = createStore(reducer, compose(middleware))
}

//sagaMiddleware.run(rootSaga);

export default store