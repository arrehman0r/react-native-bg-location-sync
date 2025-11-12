import { combineReducers } from "@reduxjs/toolkit";
import utilsReducer from "./utilsSlice";
import userReducer from "./userSlice";
import locationReducer from "./locationSlice";

const rootReducer = combineReducers({
  utils: utilsReducer,
  user: userReducer,
  location: locationReducer,
  
});

export default rootReducer;