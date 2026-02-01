import { useState } from "react";

function CreateTodoForm(props) {
  const [todoFormData, setTodoFormData] = useState({
    userid: "",
    title: "",
    description: "",
    status: "",
    due_data: "",
    todoid: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTodoFormData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/addtask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: todoFormData.userid,
          title: todoFormData.title,
          description: todoFormData.description,
          status: todoFormData.status,
          due_data: todoFormData.due_data,
        }),
      });
      const data = await response.json();
      
      // Check if the response was successful
      if (!response.ok || !data.todo) {
        setError(data.error || "Task creation failed");
        console.error("API Error:", data);
        return;
      }
      
      const createdTodo = {
        ...todoFormData,
        todoid: data.todo.id,
        userid: data.todo.user_id,
      };
      
      // Add to parent component's state
      props.onAdd(createdTodo);
      
      // Reset form
      setTodoFormData({
        userid: "",
        title: "",
        description: "",
        status: "",
        due_data: "",
        todoid: "",
      });
      
      setError(""); 
      console.log("Task created successfully:", data);
    } catch (error) {
      setError("Task creation failed");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Create Todo</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="userid"
          onChange={handleInputChange}
          value={todoFormData.userid}
          placeholder="User ID"
        />
        <input
          name="title"
          onChange={handleInputChange}
          value={todoFormData.title}
          placeholder="Title"
        />
        <input
          name="description"
          onChange={handleInputChange}
          value={todoFormData.description}
          placeholder="Description"
        />
        <input
          name="status"
          onChange={handleInputChange}
          value={todoFormData.status}
          placeholder="Status"
        />
        <input
          name="due_data"
          onChange={handleInputChange}
          value={todoFormData.due_data}
          placeholder="Due Date"
        />
        <button type="submit">Create Task</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default CreateTodoForm;
