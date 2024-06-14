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

function App() {
  const PrivateRoute = () => {
    const loggedIn = localStorage.getItem("access_token");
    console.log("loggedIn", loggedIn);
    return loggedIn ? <Outlet /> : <Navigate to="/login" />;
  };

  const PubicRoutes = () => {
    const loggedIn = !localStorage.getItem("access_token");
    console.log('loggedIn1', loggedIn)
    console.log('loggedIn1', loggedIn)
    console.log('loggedIn1', typeof loggedIn)
    // console.log(object)
    return loggedIn ? <Outlet /> : <Navigate to="/dashboard" />;
  };

  return (
    <Routes>
      <Route element={<PubicRoutes />}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/login-type" element={<LoginType />} />
        <Route path="/questions" element={<Questions />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mentees" element={<Mentees />} />
        </Route>
        
      </Route>
    </Routes>
  );
}

export default App;
