import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
    
        try {
            const response = await axios.post("http://127.0.0.1:8000/forgot_password/", {
                username: username
            });
    
            setMessage(response.data.message); // Navigate to OTP verification page, passing the username
           
            navigate(`/verify_otp/${response.data.user_id}`, { state: { username } });

    
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        }
    };
    
    return (

        <div className="flex justify-center items-center min-h-screen bg-[#E6E6FA]">
  <div className="bg-white p-8 rounded-lg shadow-xl w-96 border border-[#C8A2C8]">
    <h2 className="text-2xl font-semibold text-center mb-4 text-[#7B2CBF]">Forgot Password</h2>
    
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[#6A5ACD] font-medium">Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-[#9370DB] rounded-md focus:ring-2 focus:ring-[#7B2CBF] focus:outline-none"
          required
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#7B2CBF] to-[#9370DB] text-white py-2 rounded-md shadow-md hover:opacity-90 transition font-medium"
      >
        Send OTP
      </button>
    </form>

    {message && <p className="text-green-600 text-center mt-4">{message}</p>}
    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
  </div>
</div>

    );
};

export default ForgotPassword;
