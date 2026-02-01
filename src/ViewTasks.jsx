
import { useState, useEffect } from "react";
import TodoView from "./TodoList";

function ViewTasks(props) {
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [userId, setUserId] = useState("");
  const [userTasks, setUserTasks] = useState([]);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "",
    due_data: ""
  });

  const handleDelete = async (todoid, userid) => {
    try {
      const response = await fetch(`http://localhost:4000/deletetask/${userid}/${todoid}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },

      });
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Delete failed");
        console.error("API Error:", data);
        return;
      }
      
      console.log("Task deleted successfully:", data);
      
      props.onDelete(todoid);
      setError("");
      
    } catch (error) {
      setError("Delete failed");
      console.error(error);
    }
  };


  const handleEdit = (todoItem) => {
    setEditingId(todoItem.todoid);
    setEditForm({
      title: todoItem.title,
      description: todoItem.description,
      status: todoItem.status,
      due_data: todoItem.due_data
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", description: "", status: "", due_data: "" });
  };

  const handleUpdate = async (todoid, userid) => {
    try {
      const response = await fetch(`http://localhost:4000/updatetasks/${userid}/${todoid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({

          title: editForm.title,
          description: editForm.description,
          status: editForm.status,
          due_data: editForm.due_data,
        }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Update failed");
        console.error("API Error:", data);
        return;
      }
      
      console.log("Task updated successfully:", data);
      
      props.onUpdate(todoid, editForm);
      setEditingId(null);
      setEditForm({ title: "", description: "", status: "", due_data: "" });
      setError("");
      
    } catch (error) {
      setError("Update Failed");
      console.error(error);
    }
  };

  const fetchUserTasks = async () => {
    if (!userId) {
      setUserTasks([]);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:4000/alltasks/${userId}`);
      const data = await response.json();
      
      if (response.ok && data.tasks) {
        setUserTasks(data.tasks);
        setError("");
      } else {
        setError(data.error || "Failed to fetch tasks");
        setUserTasks([]);
      }
    } catch (error) {
      setError("Failed to fetch tasks");
      console.error(error);
      setUserTasks([]);
    }
  };

  const displayTasks = userId ? userTasks : props.todoList;

  return (
    <div>
      <h2>Todo List</h2>
      <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
        <label>Enter User ID to view tasks: </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button onClick={fetchUserTasks}>Load Tasks</button>
      </div>

      {error && <p style={{color: 'red'}}>{error}</p>}
      {displayTasks.length === 0 ? (
        <p>No tasks yet. Create one!</p>
      ) : (
        displayTasks.map((todoItem) => (
          <div key={todoItem.todoid}>
            {editingId === todoItem.todoid ? (
              <div style={{ border: '2px solid #007bff', padding: '1rem', margin: '1rem 0' }}>
                <h3>Edit Task</h3>
                <div>
                  <label>Title:</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
                  />
                </div>
                <div>
                  <label>Description:</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
                  />
                </div>
                <div>
                  <label>Status:</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label>Due Date:</label>
                  <input
                    type="date"
                    value={editForm.due_data}
                    onChange={(e) => setEditForm({ ...editForm, due_data: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
                  />
                </div>
                <button onClick={() => handleUpdate(todoItem.todoid, todoItem.userid)} style={{ marginRight: '0.5rem' }}>
                  Save
                </button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <>
                <TodoView
                  title={todoItem.title}
                  description={todoItem.description}
                  status={todoItem.status}
                  due_data={todoItem.due_data}
                  userid={todoItem.userid}
                  todoid={todoItem.todoid}
                />
                <button onClick={() => handleEdit(todoItem)} style={{ marginRight: '0.5rem' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(todoItem.todoid, todoItem.userid)}>Delete</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ViewTasks;
