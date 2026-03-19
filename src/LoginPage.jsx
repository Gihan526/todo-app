import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "./authFetch";

function LoginPage(props) {
  const navigate = useNavigate();
  const [loginFormData, setLoginFormData] = useState({
    name: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginFormData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(buildApiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: loginFormData.name,
          password: loginFormData.password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      console.log("Login successful:", data);
      navigate("/tasks");
    } catch (error) {
      setError("Login failed");
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-center text-lg pt-5 mb-5">Login</h1>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full max-w-md mx-auto border rounded p-13"
      >
        <input
          type="text"
          name="name"
          value={loginFormData.name}
          onChange={handleLoginChange}
          placeholder="Name"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          name="password"
          value={loginFormData.password}
          onChange={handleLoginChange}
          placeholder="Password"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
      {error && <p className="text-red-600 text-center mt-4">{error}</p>}
    </div>
  );
}

export default LoginPage;
