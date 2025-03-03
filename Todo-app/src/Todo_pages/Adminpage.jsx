import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token"); 

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/admin_page/", {
        headers: { Authorization: `Token ${token}` }, 
      })
      .then((response) => setUsers(response.data.users))
      .catch((error) => console.error("Error fetching users:", error));
  }, [token]);

  const toggleBlock = async (userId) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/block-unblock/${userId}/`,
        {},
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_active: !user.is_active } : user
        )
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      alert("Failed to update user status.");
    }
  };

  return (
    <div className="container mx-auto mt-10 px-6">
    <h2 className="text-3xl font-bold text-[#7B2CBF] mb-6 text-center">Admin Dashboard</h2>

    <div className="overflow-x-auto mt-[10px] w-full">
    <table className=" bg-white w-full shadow-md rounded-xl overflow-hidden">
      <thead className="bg-gradient-to-r from-[#7B2CBF] to-[#A288E3] text-white uppercase">
        <tr>
          <th className="py-3 px-5 text-left">ID</th>
          <th className="py-3 px-5 text-left">Username</th>
          <th className="py-3 px-5 text-left">Email</th>
          <th className="py-3 px-5 text-center">Status</th>
          <th className="py-3 px-5 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b hover:bg-gray-100 transition">
            <td className="py-3 px-5">{user.id}</td>
            <td className="py-3 px-5">{user.username}</td>
            <td className="py-3 px-5">{user.email}</td>
            <td className="py-3 px-5 text-center">
              <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                user.is_active ? "bg-green-500" : "bg-red-500"
              }`}>
                {user.is_active ? "Active" : "Blocked"}
              </span>
            </td>
           <td className="py-3 px-5 text-center flex justify-center space-x-4">
           <button className="px-4 py-2 bg-[#7B2CBF] text-white rounded-lg shadow-md hover:bg-[#A288E3] transition duration-300 mr-[10px]" onClick={() => navigate(`/user_tasks/${user.id}`)}>
           View Tasks
           </button>
          <button className={`px-4 py-2 text-white rounded-lg shadow-md transition duration-300  ${user.is_active? "bg-red-500 hover:bg-red-600"
        : "bg-green-500 hover:bg-green-600"}`}onClick={() => toggleBlock(user.id)} >
          {user.is_active ? "Block" : "Unblock"}
         </button>
         </td>
         </tr>
        ))}
        </tbody>
       </table>
      </div>
     </div>

     );
     };

export default AdminPage;
