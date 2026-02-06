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

  function deleteToList(todoid) {
    setTodoList((prevTodos) => {
      return prevTodos.filter((todo) => todo.todoid !== todoid);
    });
  }

  function updateTodoInList(todoid, updatedData) {
    setTodoList((prevTodos) => {
      return prevTodos.map((todo) =>
        todo.todoid === todoid ? { ...todo, ...updatedData } : todo,
      );
    });
  }
  // className="max-w-fit mx-auto"> or u can use.  max-w-2xl max width thingy
  return (
    <div className="min-h-screen bg-gray-100 ">
      <nav className="max-w-fit mx-auto">
        <h1 className="text-center text-3xl font-bold pt-5">Taskly</h1>
        <ul className="justify-center border border-zinc-250 px-5 flex  space-x-6 mt-5 rounded py-2">
          <li
            onClick={() => setActiveTab("register")}
            className="cursor-pointer hover:text-blue-600"
          >
            Register
          </li>
          <li
            onClick={() => setActiveTab("todo")}
            className="cursor-pointer hover:text-blue-600"
          >
            Create Todo
          </li>
          <li
            onClick={() => setActiveTab("view")}
            className="cursor-pointer hover:text-blue-600"
          >
            View Tasks
          </li>
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
