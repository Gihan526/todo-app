import { useState, useEffect } from "react";
import { authFetch, buildApiUrl } from "./authFetch";

function ViewTasks(props) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-600";
      case "In Progress":
        return "bg-blue-50 text-blue-600";
      case "Pending":
        return "bg-yellow-50 text-yellow-600";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "",
    due_date: "",
    todoid: null,
    userid: null,
  });

  useEffect(() => {
    fetchUserTasks();
  }, []);

  const handleDelete = async (todoid, userid) => {
    const taskId = todoid;
    const userId = userid;

    if (!taskId || !userId) {
      setError("Invalid task ID or user ID");
      console.error("Delete failed - missing IDs:", { taskId, userId });
      return;
    }

    try {
      const response = await authFetch(
        buildApiUrl(`/deletetask/${userid}/${todoid}`),
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Delete failed");
        console.error("API Error:", data);
        return;
      }

      console.log("Task deleted successfully:", data);

      fetchUserTasks();
      setError("");
    } catch (error) {
      setError("Delete failed");
      console.error(error);
    }
  };

  const handleEdit = (todoItem) => {
    console.log("Editing task:", todoItem);
    const taskId = todoItem.todoid || todoItem.id;
    const userId = todoItem.userid || todoItem.user_id;

    if (!taskId || !userId) {
      setError("Invalid task ID or user ID - cannot edit");
      console.error("Missing IDs:", { taskId, userId, todoItem });
      return;
    }
    setEditingId(taskId);
    setEditForm({
      title: todoItem.title,
      description: todoItem.description,
      status: todoItem.status,
      due_date: todoItem.due_date || todoItem.due_data || "",
      todoid: taskId,
      userid: userId,
    });
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      description: "",
      status: "",
      due_date: "",
      todoid: null,
      userid: null,
    });
    setError("");
  };

  const handleUpdate = async (todoid, userid) => {
    if (!todoid || !userid) {
      setError("Invalid task ID or user ID");
      return;
    }

    try {
      const response = await authFetch(
        buildApiUrl(`/updatetasks/${userid}/${todoid}`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editForm.title,
            description: editForm.description,
            status: editForm.status,
            due_date: editForm.due_date,
          }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Update failed");
        console.error("API Error:", data);
        return;
      }

      console.log("Task updated successfully:", data);

      fetchUserTasks();
      setEditingId(null);
      setEditForm({
        title: "",
        description: "",
        status: "",
        due_date: "",
        todoid: null,
        userid: null,
      });
      setError("");
    } catch (error) {
      setError("Update Failed");
      console.error(error);
    }
  };

  const fetchUserTasks = async () => {
    try {
      const response = await authFetch(buildApiUrl("/mytasks"));
      const data = await response.json();

      if (response.ok && data.tasks) {
        const normalizedTasks = data.tasks.map((task) => ({
          ...task,
          due_date: task.due_date || task.due_data || "",
          todoid: task.todoid || task.id,
          userid: task.userid || task.user_id,
        }));
        setUserTasks(normalizedTasks);
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

  return (
    <div className="max-w-2xl mx-auto ">
      <h2 className="text-center text-lg mb-5 ">Todo List</h2>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {userTasks.length === 0 ? (
        <p className="text-center text-gray-600">No tasks yet. Create one!</p>
      ) : (
        userTasks.map((todoItem) => {
          const taskId = todoItem.todoid || todoItem.id;
          const userId = todoItem.userid || todoItem.user_id;

          return (
            <div key={taskId || `temp-${Math.random()}`}>
              {editingId === taskId ? (
                <div className="border rounded p-13 mb-8">
                  <h3 className="text-center text-lg mb-5">Edit Task</h3>
                  <form className="flex flex-col gap-4">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      placeholder="Title"
                      className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description"
                      className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm({ ...editForm, status: e.target.value })
                      }
                      className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <input
                      type="date"
                      value={editForm.due_date}
                      onChange={(e) =>
                        setEditForm({ ...editForm, due_date: e.target.value })
                      }
                      className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdate(editForm.todoid, editForm.userid)
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex-1"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="sm:border border-gray-300 rounded sm:p-4 bg-white sm:mb-4 border sm:w-xl  p-4 mb-4 w-90 m-auto">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {todoItem.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {todoItem.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(todoItem.status)}`}
                      >
                        {todoItem.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {todoItem.due_date}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(todoItem)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(taskId, userId)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default ViewTasks;
