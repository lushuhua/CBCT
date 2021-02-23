import { combineReducers } from "redux"
import userReducer from "./userReducer"
//import attributeSetReducer from './AttributeSet'
import app from './app'

var reducers = {userReducer,app};
export default combineReducers(reducers)
