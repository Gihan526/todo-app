import { useState } from "react";
import RegisterUserForm from "./RegisterUserForm";
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
    <div className="min-h-screen bg-gray-100 ">
      <nav>
        <h1>Todo App</h1>
        <ul className="flex justify-center space-x-6 border border-gray-300 rounded px-6 py-3 mx-auto w-96">
          <li onClick={() => setActiveTab("register")} className="cursor-pointer hover:text-blue-600">Register</li>
          <li onClick={() => setActiveTab("todo")} className="cursor-pointer hover:text-blue-600">Create Todo</li>
          <li onClick={() => setActiveTab("view")} className="cursor-pointer hover:text-blue-600">View Tasks</li>
        </ul>
      </nav>

      <div className="flex justify-center mt-11 ">
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
