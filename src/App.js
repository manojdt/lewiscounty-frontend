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
            <Route path="/create-programs" element={<CreatePrograms />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/mentees" element={<Mentees />} />
          </Route>
        </Route>
    </Routes>
  );
}

export default App;
