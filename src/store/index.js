import {
  configureStore,
  combineReducers
} from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";


const combinedReducer = combineReducers({
  userInfo: userReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'logout') { //We are calling this RESET, but call what you like!
    state = undefined
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer

});