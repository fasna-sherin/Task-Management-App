
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


function RegisterForm() {
  const navigate = useNavigate();
 

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    
  });

  
  return (
    <div className="bg-[#E7E6F7] h-[945px] w-full">
 
    <div className="bg-[#E7E6F7]   flex justify-center items-center ">
     
        <div className="w-1/2 h-full  flex flex-col justify-center items-center p-10 ml-[270px] mt-[50px] ">
          <Formik
            initialValues={{ username: "", email: "", password: "", confirm_password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              axios.post("http://127.0.0.1:8000/register/", values)
                .then((response) => {
                  
                  navigate("/");
                })
                .catch((error) => {
                  console.error("Error:", error.response?.data || error.message);
                })
                .finally(() => setSubmitting(false));
            }}
          >
            {({ isSubmitting }) => (
              
              <div className="flex shadow-lg rounded-2xl">
 
  <div className="w-[500px] h-[650px] shadow-lg rounded-2xl bg-white p-8 ">
    <Form className="bg-white">
     
      <label className="text-gray-700 text-sm font-medium">Username</label>
      <Field
        type="text"
        name="username"
        placeholder="Enter your username"
        className="w-full p-3 border bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7B2CBF]  mt-1"
      />
      <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
      
      <label className="text-gray-700 text-sm font-medium">Email</label>
      <Field
        type="email"
        name="email"
        placeholder="Enter your email"
        className="w-full p-3 border bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7B2CBF]  mt-1"
      />
      <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

      <label className="text-gray-700 text-sm font-medium">Password</label>
      <Field
        type="password"
        name="password"
        placeholder="Enter your password"
        className="w-full p-3 border bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7B2CBF]  mt-1 "
      />
      <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
 
      <label className="text-gray-700 text-sm font-medium">Confirm Password</label>
      <Field
        type="password"
        name="confirm_password"
        placeholder="Confirm your password"
        className="w-full p-3 border bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7B2CBF] mt-1"
      />
      <ErrorMessage name="confirm_password" component="div" className="text-red-500 text-sm" />

      <button
        type="submit"
        className="w-full bg-[#7B2CBF] text-white font-bold py-3 rounded-md mt-4 hover:bg-[#5A179A] transition duration-300"
        disabled={isSubmitting}
      >
        Sign Up
      </button>
    </Form>

    <p className="text-center text-sm text-gray-500 mt-4">
      By signing up, you agree to our{" "}
      <a href="#" className="text-[#7B2CBF] hover:underline">Terms of Service</a>{" "}
      and{" "}
      <a href="#" className="text-[#7B2CBF] hover:underline">Privacy Policy</a>.
    </p>
    <p className="text-center text-sm text-gray-500 mt-4">
      Already have an account?{" "}
      <button onClick={() => navigate("/")} className="text-[#7B2CBF] hover:underline">
        Log In
      </button>
    </p>
  </div>
</div>

            )}
          </Formik>
        </div>

      
        <div className="w-1/2 h-full flex flex-col justify-center items-center p-10">
        <div className="flex flex-col justify-center items-center mr-[300px]">
            <img
              src="https://static.vecteezy.com/system/resources/previews/011/345/136/non_2x/young-girl-wearing-glasses-holding-notebook-and-standing-near-big-clipboard-3d-character-illustration-png.png"
              alt="Todo Illustration"
              className="w-[500px] h-[500px]"
            />
         <h2 className="text-2xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text drop-shadow-lg tracking-wide uppercase py-6 px-8">
  Small steps every day lead to <span className="text-blue-500"><br />big achievements..</span><br /> Just <span className="text-purple-600">start.</span>
</h2>


          </div>
        </div>
     
    </div>
    </div>
      
  );
}

export default RegisterForm;
