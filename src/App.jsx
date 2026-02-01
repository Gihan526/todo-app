import { useState } from "react";
import RegisterUserForm from "./RegisterUserForm";
import "./styles/App.css";
import CreateTodoForm from "./CreateTodoForm";
import ViewTasks from "./ViewTasks";

function App() {
  const [activeTab, setActiveTab] = useState("register");
  const [todoList, setTodoList] = useState([]);

  function addTodoToList(newTodo) {
    setTodoList((prevTodos) => {
      return [...prevTodos, newTodo];
    });
  }

  function deleteToList(todoid){
    setTodoList((prevTodos) => {
      return prevTodos.filter((todo) => todo.todoid !== todoid);
    });
  }

  function updateTodoInList(todoid, updatedData) {
    setTodoList((prevTodos) => {
      return prevTodos.map((todo) => 
        todo.todoid === todoid 
          ? { ...todo, ...updatedData }
          : todo
      );
    });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav>
        <h1>Todo App</h1>
        <ul>
          <li onClick={() => setActiveTab("register")}>Register</li>
          <li onClick={() => setActiveTab("todo")}>Create Todo</li>
          <li onClick={() => setActiveTab("view")}>View Tasks</li>
        </ul>
      </nav>

      <div>
        {activeTab === "register" && <RegisterUserForm />}
        {activeTab === "todo" && <CreateTodoForm onAdd={addTodoToList} />}
        {activeTab === "view" && (
          <ViewTasks
            todoList={todoList}
            onDelete={deleteToList}
            onUpdate={updateTodoInList}
          />
        )}
      </div>
    </div>
  );
}

export default App;
