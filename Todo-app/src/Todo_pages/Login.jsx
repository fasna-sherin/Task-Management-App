
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";



function LoginForm() {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true");

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const expiration = localStorage.getItem("expires_at") || sessionStorage.getItem("expires_at");
  
    console.log("Saved Token:", savedToken);
    console.log("Expiration:", expiration);
  
    if (savedToken && expiration) {
      const now = new Date();
      const expiryDate = new Date(expiration);
  
      if (expiryDate > now) {
        const userRole = localStorage.getItem("role") || sessionStorage.getItem("role");
        navigate(userRole === "admin" ? "/admin_page" : "/todos");
      } else {
        handleLogout();
      }
    }
  }, );
  

  const validationSchema = Yup.object({
    username: Yup.string().required("username is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        ...values,
        remember_me: rememberMe,
      });
  
      if (response.data.token) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("token", response.data.token);
        storage.setItem("expires_at", response.data.expires_at || ""); // Ensure expiration is set
        const userRole = response.data.is_admin ? "admin" : "user";
        storage.setItem("role", userRole);
  
        
        navigate(userRole === "admin" ? "/admin_page" : "/todos");
      } else {
         alert("Invalid login credentials.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      
    }
    setSubmitting(false);
  };
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expires_at");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expires_at");
    navigate("/");
  };

  return (
    <div className="bg-[#E7E6F7] w-full h-full">
      <div className="w-full h-screen flex">
        <div className="w-1/2 bg-[#E7E6F7] flex flex-col justify-center items-center p-8 h-full">
          <div className="flex justify-center items-center bg-white ml-[350px] mb-[100px] rounded-2xl">
            <div className="flex shadow-lg rounded-2xl">
              <div className="w-[500px] h-[500px] shadow-lg rounded-2xl bg-white p-8 ">
                <Formik
                  initialValues={{ username: "", password: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <label className="text-gray-700 text-sm font-medium">Username</label>
                      <Field
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        className="w-full p-3 border bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7B2CBF] mt-1"
                      />
                      <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />

                      <label className="text-gray-700 text-sm font-medium mt-4 block">Password</label>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className="w-full p-3 border bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7B2CBF] mt-1"
                      />
                      <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />

                      <div className="flex justify-between items-center mt-3 text-sm">
                        <label className="flex items-center text-gray-700">
                          <input
                            type="checkbox"
                            className="mr-2 accent-[#7B2CBF]"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                          Remember Me
                        </label>
                        <button type="button" onClick={() => navigate("/forgot_password")} className="text-[#7B2CBF] hover:underline">
                          Forgot password?
                        </button>
                      </div>

                      <button type="submit" disabled={isSubmitting} className="w-full bg-[#7B2CBF] text-white font-bold py-3 rounded-md mt-4 hover:bg-[#5A179A] transition duration-300">
                        Login
                      </button>
                    </Form>
                  )}
                </Formik>

                <p className="text-center text-sm text-gray-500 mt-4">
                  By continuing, you agree to our <a href="#" className="text-[#7B2CBF] hover:underline">Terms of Service</a> and <a href="#" className="text-[#7B2CBF] hover:underline">Privacy Policy</a>.
                </p>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Don't have an account? <button onClick={() => navigate("/register")} className="text-[#7B2CBF] hover:underline">Sign Up</button>
                </p>
              </div>
             

            </div>
          </div>
        </div>
        <div className="w-1/2 bg-[#E6E6FA] flex justify-center items-center p-8">
          <div className="flex flex-col justify-center items-center mr-[300px]">
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/todo-list-illustration-download-in-svg-png-gif-file-formats--checklist-task-food-drink-illustrations-2371075.png"
               alt="Todo Illustration"
              className="w-[600px] h-[600px]"
             />
             <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#5A179A] to-[#D16BA5] drop-shadow-md tracking-wide uppercase pb-[100px] ml-[50px]">
   Plan it, <span className="text-[#D16BA5]">do it</span>, <span className="text-[#5A179A]">done it</span>!.
 </h2>


          </div>
         </div>
       </div>
     </div>
     
  );
}

export default LoginForm;
