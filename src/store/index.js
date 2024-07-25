import {
  configureStore,
  combineReducers
} from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import programReducer from "../features/program/programSlice";
import userProgramReducer from "../features/userprograms/userProgramSlice";
import goalsReducer from "../features/goals/goalsSlice";


const combinedReducer = combineReducers({
  userInfo: userReducer,
  programInfo: programReducer,
  userPrograms: userProgramReducer,
  goals: goalsReducer
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