import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
//import NavReducer from './NavReducer';

export default combineReducers({
  auth: AuthReducer,
  //nav: NavReducer
});
