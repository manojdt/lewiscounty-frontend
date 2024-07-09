import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import {
  ChangePassword,
  Dashboard,
  Questions,
  ForgotPassword,
  Login,
  LoginType,
  Signup,
  VerifyOTP,
  Mentees
} from "./component";
import Layout from "./component/Layout";
import { useSelector, useDispatch } from "react-redux";
import { updateInfo } from "./services/loginInfo";
import { useEffect } from "react";
import Programs from "./component/Programs";
import Calendar from "./component/Calendar";
import Discussions from "./component/Discussions";
import CreatePrograms from "./component/Programs/CreateProgram";
import UserGuard from "./component/UserGuard";
import ProgramDetails from "./component/Programs/ProgramDetails";
import ProgramTask from "./component/Programs/ProgramDetails/ProgramTask";
import AssignTask from "./component/Programs/ProgramDetails/AssignTask";
import AssignMentees from "./component/Programs/ProgramDetails/AssignMentees";
import ProgramCompletion from "./component/Programs/ProgramCompletion";
import Loader from "./shared/Loader";
import Logout from "./component/Logout";

function App() {
 
  const PrivateRoute = () => {
    const dispatch = useDispatch()
    const userData = useSelector(state => state.userInfo)
    const loggedIn = localStorage.getItem("access_token");
    useEffect(() => {
      if(userData.data && !Object.keys(userData.data).length){
        dispatch(updateInfo())
      }
    },[])
    // return <Outlet />
    return loggedIn ? <Outlet /> : <Navigate to="/login" />;
  };

  const PubicRoutes = () => {
    const loggedIn = !localStorage.getItem("access_token");
    return loggedIn ? <Outlet /> : <Navigate to="/dashboard" />;
  };


  return (
    
      
    
    <Routes>
      <Route element={<PubicRoutes />}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/login-type" element={<LoginType />} />
        <Route path="/questions" element={<Questions />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/program-details/:id" element={<ProgramDetails />} />
          <Route path="/program-task/:id" element={<ProgramTask />} />
          <Route path="/assign-task/:id" element={<AssignTask />} />
          <Route path="/assign-mentees/:id" element={<AssignMentees />} />
          <Route path="/start-program/:id" element={<AssignTask />} />
          <Route path="/program-completion/:id" element={<ProgramCompletion />} />

          <Route path="/create-programs" element={<CreatePrograms />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/mentees" element={<Mentees />} />
        </Route>
      </Route>

      <Route path="/logout" element={<Logout />} />
    </Routes>
    
  );
}

export default App;
