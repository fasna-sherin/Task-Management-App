import { Route,Routes} from 'react-router-dom';

import './index.css'
import Todo from "./Todo_pages/Create";
import Loginform from "./Todo_pages/Login";
import RegisterForm from "./Todo_pages/Register";
import Logoutpage from './Todo_pages/Logout';
// import Profile from './Todo_pages/Profile';
import VerifyOTP from './Todo_pages/Verify';
import ForgotPassword from './Todo_pages/Forgot';
import PasswordReset from './Todo_pages/Passwordreset';
import AdminPage from './Todo_pages/Adminpage';
import UserTasks from './Todo_pages/UserTasks';
import VoiceInput from './Todo_pages/Voice';

function App() {
  return (
    <>
    <Routes>
     <Route path="/" element = {<Loginform/> }/>
     <Route path="/register" element = {<RegisterForm/> }/>
     <Route path="/todos" element = {<Todo/> }/>
     {/* <Route path="/profile/" element={<Profile />} /> */}
     <Route path="/logout" element = {<Logoutpage/> }/>
     <Route path="/voice" element={<VoiceInput/>}/>
     <Route path="/verify_otp/:id" element={<VerifyOTP />} /> 
     <Route path="/forgot_password" element = {<ForgotPassword/> }/>
     <Route path="/password_reset/:id" element = {<PasswordReset/> }/>
     <Route path="/admin_page" element={<AdminPage/>} />
     <Route path="/user_tasks/:id" element={<UserTasks/>} />
    
    </Routes> 
   </> 
  );
}

export default App;
