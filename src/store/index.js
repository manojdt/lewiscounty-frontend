import {
  configureStore,
  combineReducers
} from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import programReducer from "../features/program/programSlice";
import userProgramReducer from "../features/userprograms/userProgramSlice";
import goalsReducer from "../features/goals/goalsSlice";
import reportsReducer from "../features/reports/reportsSlice";
import helpReducer from "../features/help/helpSlice";
import userListReducer from "../features/userList/userListSlice";


const combinedReducer = combineReducers({
  userInfo: userReducer,
  programInfo: programReducer,
  userPrograms: userProgramReducer,
  goals: goalsReducer,
  reports: reportsReducer,
  help: helpReducer,
  userList: userListReducer
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