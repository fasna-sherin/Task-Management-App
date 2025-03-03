
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); 

  console.log("User ID from URL:", id); 

  if (!id) {
    return <h1>Error: User ID is missing!</h1>; 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://127.0.0.1:8000/otp_verify/${id}/`, { otp });

      console.log("Response from server:", response.data);
      alert("OTP verified. Reset your password.");
      navigate(`/password_reset/${id}`);
    } catch (error) {
      console.error("Error response:", error.response?.data);
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    
    <div className="w-full h-full bg-[#E7E6F7]">
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="bg-white shadow-lg rounded-xl p-6 w-[350px] text-center">
      <h1 className="text-3xl font-semibold text-gray-700 mb-4">Verify OTP</h1>
      <p className="text-gray-500 mb-6">Enter the OTP sent to your email or phone</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="p-3 border rounded-lg w-full text-center text-lg outline-none focus:ring-2 focus:ring-[#7B2CBF]"
          required
        />
        <br /><br />
        <button
          type="submit"
          className="bg-[#A288E3] hover:bg-[#7B2CBF] text-white font-semibold p-3 rounded-lg w-full transition duration-300"
        >
          Verify OTP
        </button>
      </form>
    </div>
  </div>
  </div>
  );
}

export default VerifyOTP;
