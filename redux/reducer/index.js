import { combineReducers } from "@reduxjs/toolkit";
import utilsReducer from "./utilsSlice";
import userReducer from "./userSlice";

const rootReducer = combineReducers({
  utils: utilsReducer,
  user: userReducer,
  
});

export default rootReducer;