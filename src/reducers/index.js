import {combineReducers} from "redux";
import {FirebaseReducer} from "./FirebaseReducer";
import {AuthReducer} from "./AuthReducer";


export default combineReducers({
    firebase: FirebaseReducer,
    authUser: AuthReducer
});