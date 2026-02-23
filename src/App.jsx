import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import RegisterUserForm from "./RegisterUserForm";
import CreateTodoForm from "./CreateTodoForm";
import ViewTasks from "./ViewTasks";
import LoginPage from "./LoginPage";

function App() {
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
          <li>
            <Link to="/register" className="cursor-pointer hover:text-blue-600">
              Register
            </Link>
          </li>
          <li>
            <Link to="/login" className="cursor-pointer hover:text-blue-600">
              Login
            </Link>
          </li>
          <li>
            <Link to="/todo" className="cursor-pointer hover:text-blue-600">
              Create Todo
            </Link>
          </li>
          <li>
            <Link to="/tasks" className="cursor-pointer hover:text-blue-600">
              View Tasks
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex justify-center mt-11 ">
        <Routes>
          <Route path="/register" element={<RegisterUserForm />} />
          <Route path="/todo" element={<CreateTodoForm onAdd={addTodoToList} />} />
          <Route path="/tasks" element={
            <ViewTasks
              todoList={todoList}
              onDelete={deleteToList}
              onUpdate={updateTodoInList}
            />
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RegisterUserForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
