import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import VoiceInput from "./Voice";



function Todo() {
    const [todoTitle, setTodoTitle] = useState("");
    const [todoDescription, setTodoDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [category, setCategory] = useState("others");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");
    const navigate = useNavigate();

    const fetchTodos = useCallback(async () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            
            navigate("/");
            return;
        }
        try {
            const response = await axios.get("http://127.0.0.1:8000/todos/?sort_by=priority", {
                headers: { Authorization: `Token ${token}` },
            });
            setTodos(response.data);
        } catch (error) {
            console.error("Error fetching todos:", error);
            
        }
    }, [navigate]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);
 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            if (!token) {
                console.error("No token found! User might not be logged in.");
                return;
            }

            const headers = {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
            };

            if (editingId) {
                await axios.put(
                    `http://127.0.0.1:8000/todos/${editingId}/`,
                    { todo_title: todoTitle, todo_description: todoDescription,category ,due_date: dueDate ? new Date(dueDate).toISOString() : null,},
                    { headers }
                );
                setEditingId(null);
            } else {
                await axios.post(
                    "http://127.0.0.1:8000/todos/",
                    { todo_title: todoTitle, todo_description: todoDescription,category,due_date: dueDate ? new Date(dueDate).toISOString() : null, },
                    { headers }
                );
            }

            setTodoTitle("");
            setTodoDescription("");
            setDueDate("");
            fetchTodos(); 
        } catch (error) {
            console.error("Error saving todo:", error.response?.data || error.message);
           
        }
    };
    
const editTodo = (todo) => {
      setTodoTitle(todo.todo_title);
      setTodoDescription(todo.todo_description);
      setCategory(todo.category); 
      setPriority(todo.priority); 
      setEditingId(todo.id);
  };
  
const deleteTodo = async (id) => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
        if (!token) {
            console.error("No token found! User might not be logged in.");
          
            navigate("/login");  
            return;
        }
    
        try {
            await axios.delete(`http://127.0.0.1:8000/todos/${id}/`, {
                headers: { Authorization: `Token ${token}` },
            });
           setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
    
          
        } catch (error) {
            console.error("Error deleting todo:", error.response?.data || error.message);
           
        }
    };
    
const todoCompletion = async (id) => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
            alert("Authentication required. Please log in.");
            return;
        }

        const response = await axios.put(
            `http://127.0.0.1:8000/todocomplete/${id}/`, 
            {}, 
            { headers: { Authorization: `Token ${token}` } }
        );

       
        setTodos(prevTodos => 
            prevTodos.map(todo => 
                todo.id === id ? { ...todo, is_completed: !todo.is_completed } : todo
            )
        );

        } catch (error) {
        console.error("Error updating todo status:", error);
    }
};

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = [...todos];
        const [movedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, movedItem);

        setTodos(items);

        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (!token) {
               
                return;
            }
            await axios.post(
                "http://127.0.0.1:8000/todos/reorder/",
                {
                    reordered_todos: items.map((todo, index) => ({
                        id: todo.id,
                        new_order: index,
                    })),
                },
                { headers: { Authorization: `Token ${token}` } }
            );

            fetchTodos();
        } catch (error) {
            console.error("Error updating order:", error);
            
        }
    };
    
    return (
        <>
            <Navbar />
            <div className="w-full min-h-screen bg-[#E7E6F7] p-6">
                <div className="w-[800px] mx-auto p-6 bg-[#EEEEFF] shadow-md rounded-lg">
                    <h1 className="text-2xl font-bold text-center mb-4">
                        To-<span className="text-[#434375]">Do</span>-List
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            <label>Category:</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded flex-1">
                                <option value="work">Work</option>
                                <option value="personal">Personal</option>
                                <option value="urgent">Urgent</option>
                                <option value="study">Study</option>
                                <option value="others">Others</option>
                            </select>
                            <label>Priority:</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border p-2 rounded flex-1">
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            <label>Date:</label>
                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border p-2 rounded flex-1" />
                        </div>
                        
                        <div className="relative w-full">
                       <input type="text"placeholder="Todo Title"value={todoTitle}onChange={(e) => setTodoTitle(e.target.value)}className="border p-2 w-full rounded pr-10" />
 
                      <div className="absolute inset-y-0 right-2 flex items-center"><VoiceInput onTextChange={setTodoTitle} /></div>
                      </div>
                         <div className="relative w-full">
                       <input type="text"placeholder="Todo Description"value={todoDescription}onChange={(e) => setTodoDescription(e.target.value)}className="border p-2 w-full rounded pr-10" />
                       <div className="absolute inset-y-0 right-2 flex items-center">
                        <VoiceInput onTextChange={setTodoDescription} />
                        </div>
                        </div>
 
                         <div className="flex justify-between">
                             
                            
                             <button type="submit" className="bg-[#575799] hover:bg-[#434375] text-white px-4 py-2 rounded w-[200px]">
                                 {editingId ? "Update" : "Add"}
                             </button>

                         </div>
                     </form>
       
                     <DragDropContext onDragEnd={handleDragEnd}>
                         <Droppable droppableId="todos">
                             {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="mt-6 space-y-4">Ś
                                    {todos.length > 0 ? (
                                        todos.map((todo, index) => (
                                            <Draggable key={todo.id.toString()} draggableId={todo.id.toString()} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border rounded-lg shadow-lg flex items-center bg-white p-4">
                                                        
                                                        <input 
                                                        type="checkbox" 
                                                         checked={todo.is_completed} 
                                                       
                                                        onChange={() => todoCompletion(todo.id)}
                                                        className="w-[20px] h-[20px] accent-purple-500" 
                                                    />
                                                  


                                                    <div className="flex-1 ml-4">
                                                         <h6 className="font-bold text-gray-800">{todo.todo_title}</h6>
                                                         <p className="text-gray-600">{todo.todo_description}</p>
                                                        
                                                     </div>
                                                     <div className="flex space-x-4">
                                                         <button className="bg-[#C8A2C8] hover:bg-[#A67EA7] text-white p-2 rounded-lg"  onClick={() => editTodo(todo)}><FaEdit /></button>
                                                         <button className="bg-[#D8BFD8] hover:bg-[#B491B4] text-white p-2 rounded-lg"  onClick={() => deleteTodo(todo.id)}><FaTrash /></button>
                                                     </div>
                                                     </div>
                                                )}
                                            </Draggable>
                                        ))
                                    ) : (
                                         <p>No tasks available</p>
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
             </div>
        </>
    );
}

export default Todo;
