
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserTasks = () => {
  const { id } = useParams(); 
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.get(`http://127.0.0.1:8000/user_tasks/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (response.status === 200) {
          setTasks(response.data.tasks);
          setUsername(response.data.user);
        } else {
          setError("No tasks found.");
        }
      } catch (error) {
        setError("Error fetching tasks. Make sure you have admin access.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white  rounded-lg">
  <h2 className="text-2xl font-bold text-[#7B2CBF] mb-4 text-center">Tasks of {username}</h2>

  {tasks.length > 0 ? (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="p-4 bg-gray-100  rounded-lg  transition duration-300 hover:shadow-lg hover:bg-gray-200 flex justify-between items-center"
        >
          <div>
            <strong className="text-lg text-[#7B2CBF]">{task.todo_title}</strong>
            <p className="text-gray-600">{task.todo_description}</p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              task.is_completed
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {task.is_completed ? "✅ Completed" : "❌ Not Completed"}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 text-center mt-4">No tasks found for this user.</p>
  )}
</div>

  );
};

export default UserTasks;

