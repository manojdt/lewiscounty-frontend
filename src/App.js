import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import {
  ChangePassword,
  Dashboard,
  Questions,
  ForgotPassword,
  Login,
  LoginType,
  Signup,
  VerifyOTP,
  Mentees,
} from './component';
import Layout from './component/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { updateInfo } from './services/loginInfo';
import { useEffect } from 'react';
import Programs from './component/Programs';
import ProgramData from './component/ProgramData';
import ProgramsData from './component/ProgramsData';
import CreatePrograms from './component/Programs/CreateProgram';
import UserGuard from './component/UserGuard';
import ProgramDetails from './component/Programs/ProgramDetails';
import ProgramTask from './component/Programs/ProgramDetails/ProgramTask';
import AssignTask from './component/Programs/ProgramDetails/AssignTask';
import AssignMentees from './component/Programs/ProgramDetails/AssignMentees';
import ProgramCompletion from './component/Programs/ProgramCompletion';
import Loader from './shared/Loader';
import Logout from './component/Logout';
import MentorDetails from './component/MentorDetails';
import { Mentor } from './component/Dashboard/Mentor';
import { Mentors } from './component/Mentors';
import { Tasks } from './component/Tasks';
import { TaskDetails } from './component/Tasks/TaskDetails';
import MentorTask from './component/Mentor/Task';
import MentorTaskDetails from './component/Mentor/Task/TaskDetails';
import PreviewTaskDetails from './component/Tasks/PreviewTaskDetails';
import Reports from './component/Reports';
import CreateReport from './component/Reports/CreateReport';
import ViewReport from './component/Reports/ViewReport';
import EditReport from './component/Reports/EditReport';
import Goals from './component/Goals';
import ViewGoal from './component/Goals/ViewGoal';
import Feedback from './component/Feedback';
import Certificate from './component/Certificate';
import CertificateDetails from './component/Certificate/CertificateDetails';
import MentorViewMenteeGoal from './component/Goals/MentorViewMenteeGoal';
import Profile from './component/Profile';
import MyProfile from './component/Profile/MyProfile';
import EditProfile from './component/Profile/EditProfile';
import NotificationMenu from './component/Notification/NotificationMenu';
import Feeds from './component/Feeds';
import FeedDetails from './component/Feeds/FeedDetails';
import HelpPage from './component/Help/Help';
import CalendarMain from './component/Calendar/CalendarMain';
import CreateMeeting from './component/Calendar/CreateMeeting';
import { Calendar } from 'primereact/calendar';
import Scheduler from './component/Calendar';
import Discussions from './component/Discussions';
import DiscussionDetails from './component/Discussions/DiscussionDetails';
import AllRequest from './component/Programs/AllRequest';
import Members from './component/Members';
import LaunchProgram from './component/Programs/LaunchProgram';
import MentorProfile from './component/MentorProfile/MentorProfile';
import CreateCertificate from './component/Certificate/CreateCertificate';
import GenerateCertificate from './component/Certificate/GenerateCertificate';
import CertificateMemberDetails from './component/Certificate/CertificateMemberDetails';
import CertificateMenteeList from './component/Certificate/CertificateMenteeList';
import AssignMentor from './component/Members/AssignMentor';
import MentorChangeRequest from './component/MentorDetails/MentorChangeRequest';
import MenteeDocs from './component/Programs/ProgramDetails/MenteeDocs';
import SuperMembers from './component/SuperAdmin/Members/SuperMembers';
import AddSuperMember from './component/SuperAdmin/Members/AddSuperMember';
import DocumentUpload from './component/Mentees/DocumentUpload';
import MentorMenteeProfile from './component/mentorMenteeProfile';
import ProfileView from './component/Profile/ProfileView';
import Category from './component/category';
import CategoryView from './component/category/categoryView';
import MenteeTaskList from './component/Tasks/MenteeTaskList';
import ViewTask from './component/Mentor/Task/viewTask';

function App() {
  const PrivateRoute = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userInfo);
    const loggedIn = localStorage.getItem('access_token');
    useEffect(() => {
      if (userData.data && !Object.keys(userData.data).length) {
        dispatch(updateInfo());
      }
    }, []);
    // return <Outlet />
    return loggedIn ? <Outlet /> : <Navigate to='/login' />;
  };

  const PubicRoutes = () => {
    const loggedIn = !localStorage.getItem('access_token');
    return loggedIn ? <Outlet /> : <Navigate to='/dashboard' />;
  };

  return (
    <Routes>
      <Route element={<PubicRoutes />}>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        <Route path='/change-password' element={<ChangePassword />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<Layout subheader={true} />}>
          <Route path='/super-members' element={<SuperMembers />} />
          <Route path='/super-members/add' element={<AddSuperMember />} />
          <Route path='/my-profile-admin' element={<Profile />} />
          <Route path='/help-admin' element={<HelpPage />} />
        </Route>

        <Route path='/login-type' element={<LoginType />} />
        <Route path='/questions' element={<Questions />} />
        <Route element={<Layout />}>
          <Route path='/dashboard' element={<Dashboard />} />

          <Route path='/mentor-doc-upload' element={<DocumentUpload />} />
          <Route path='/mentee-doc-upload/:id' element={<DocumentUpload />} />
          <Route path='/mentee-document-upload/:id' element={<MenteeDocs />} />
          <Route path='/programs' element={<Programs />} />
          <Route path='/program-details/:id' element={<ProgramDetails />} />
          <Route path='/program-task/:id' element={<ProgramTask />} />
          <Route path='/assign-task/:id' element={<AssignTask />} />
          <Route path='/assign-mentees/:id' element={<AssignMentees />} />
          <Route path='/assign-mentees' element={<AssignMentees />} />
          <Route path='/start-program/:id' element={<AssignTask />} />
          <Route path='/submit-task-program/:id' element={<TaskDetails />} />
          <Route
            path='/program-completion/:id'
            element={<ProgramCompletion />}
          />

          <Route path='/create-programs' element={<CreatePrograms />} />
          <Route path='/update-program/:id' element={<CreatePrograms />} />
          <Route path='/all-request' element={<AllRequest />} />
          <Route path='/program' element={<ProgramData />} />

          <Route path='/calendar' element={<Scheduler />} />
          <Route path='/create-meeting' element={<CreateMeeting />} />
          <Route path='/edit-meeting' element={<CreateMeeting />} />
          <Route path='/members' element={<Members />} />
          <Route path='/assignMentor' element={<AssignMentor />} />

          <Route path='/discussions' element={<Discussions />} />

          <Route path='/mentor-profile/:id' element={<ProfileView />} />

          <Route path='/edit-profile' element={<EditProfile />} />
          <Route path='/program-data' element={<ProgramsData />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='/help' element={<HelpPage />} />
          <Route path='/notification' element={<NotificationMenu />} />
          <Route path='/feeds' element={<Feeds />} />
          <Route path='/feed-details/:id' element={<FeedDetails />} />
          <Route path='/my-profile' element={<Profile />} />
          <Route path='/profile' element={<MyProfile />} />

          <Route path='/certificates' element={<Certificate />} />
          <Route path='/create-certificate' element={<CreateCertificate />} />
          <Route
            path='/certificate-view/:id'
            element={<CertificateDetails />}
          />
          <Route
            path='/generate_certificate/:id'
            element={<GenerateCertificate />}
          />
          <Route
            path='/certificate_members/:id'
            element={<CertificateMemberDetails />}
          />
          <Route
            path='/certificate_mentees/:id'
            element={<CertificateMenteeList />}
          />

          <Route path='/mentors' element={<Mentors />} />
          <Route path='/mentor-details/:id' element={<ProfileView />} />
          <Route path='/mentor-tasks' element={<MentorTask />} />
          <Route
            path='/mentor-tasks-details/:id'
            element={<MentorTaskDetails />}
          />
          <Route path='/mentor-change-view' element={<MentorChangeRequest />} />

          <Route path='/mentees' element={<Mentees />} />
          <Route path='/mentee-details/:id' element={<ProfileView />} />
          <Route path='/mentee-tasks' element={<Tasks />} />
          <Route path='/mentee-task_list/:id' element={<MenteeTaskList />} />
          <Route path='/mentee-tasks-details/:id' element={<TaskDetails />} />
          <Route
            path='/preview-mentee-tasks-details/:id'
            element={<PreviewTaskDetails />}
          />

          <Route path='/launch-program' element={<LaunchProgram />} />
          <Route path='/goals' element={<Goals />} />
          <Route
            path='/mentor-view-mentee-goal/:id'
            element={<MentorViewMenteeGoal />}
          />
          <Route path='/view-goal/:id' element={<ViewGoal />} />

          <Route path='/reports' element={<Reports />} />
          <Route path='/create-report' element={<CreateReport />} />
          <Route path='/edit-report/:id' element={<EditReport />} />
          <Route path='/view-report/:id' element={<ViewReport />} />
          <Route path='/profileView' element={<MentorMenteeProfile />} />
          <Route path='/category' element={<Category />} />
          <Route path='/categoryView' element={<CategoryView />} />
          <Route path='/viewTask/:id' element={<ViewTask />} />          
        </Route>
      </Route>

      <Route path='/logout' element={<Logout />} />
    </Routes>
  );
}

export default App;
