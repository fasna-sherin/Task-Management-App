
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Logoutpage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
        console.error("No authentication token found!");
        alert("Session expired or already logged out.");
        navigate("/login");
        return;
    }

    axios
        .post(
            "http://127.0.0.1:8000/logout/",
            {},
            {
                headers: {
                    Authorization: `Token ${token}`, 
                },
            }
        )
        .then((response) => {
            console.log("Logout successful:", response.data);

            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            localStorage.removeItem("expires_at");
            sessionStorage.removeItem("expires_at");

           
            navigate("/"); 
        })
        .catch((error) => {
            console.error("Error logging out:", error.response?.data || error.message);
           
        });
};



  return (
    <div>
     <button onClick={handleLogout}  className=" w-[120px] h-[40px] bg-[#F4FDFF] text-[#7B2CBF] font-bold !rounded-xl shadow-md transition duration-300 ease-in-out transform hover:bg-[#A288E3] hover:scale-105 hover:text-[#ffffff] focus:ring-2 focus:ring-[#A288E3] focus:outline-none">
  Logout
</button>

    </div>
  );
}

export default Logoutpage;
