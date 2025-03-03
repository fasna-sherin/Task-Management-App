import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PasswordReset = () => {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await axios.post(`http://127.0.0.1:8000/password_reset/${id}/`, {
                password1,
                password2
            });

            setMessage(response.data.message);
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#E7E6F7]">
        <div className="bg-white p-8 rounded-xl shadow-xl w-96 border border-purple-300">
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-4">Reset Password</h2>
          <p className="text-gray-600 text-center mb-6">Enter your new password below</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-purple-600 font-medium">New Password:</label>
              <input
                type="password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-purple-600 font-medium">Confirm Password:</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full p-3 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white font-semibold py-3 rounded-md hover:bg-purple-600 transition duration-300"
            >
              Reset Password
            </button>
          </form>
  
          {message && <p className="text-green-600 text-center mt-4 font-medium">{message}</p>}
          {error && <p className="text-red-500 text-center mt-4 font-medium">{error}</p>}
        </div>
      </div>
    );
};

export default PasswordReset;
