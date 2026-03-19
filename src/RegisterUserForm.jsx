import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "./authFetch";

function RegisterUserForm() {
  const navigate = useNavigate();
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    id: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(buildApiUrl("/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: userFormData.name,
          email: userFormData.email,
          password: userFormData.password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setUserFormData((prevValue) => ({
        ...prevValue,
        id: data.user?.id || "",
      }));

      console.log("Registration successful:", data);
      setError("");
      navigate("/todo");
    } catch (error) {
      setError("Registration failed");
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-center text-lg pt-5 mb-5">Register User</h1>
      {userFormData.id && (
        <p className="text-center mt-5">
          Hello {userFormData.name}, ID: {userFormData.id}, registered
          successfully!
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md mx-auto border rounded p-13"
      >
        <input
          name="name"
          onChange={handleInputChange}
          value={userFormData.name}
          placeholder="Name"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="email"
          onChange={handleInputChange}
          value={userFormData.email}
          placeholder="Email"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="password"
          onChange={handleInputChange}
          value={userFormData.password}
          placeholder="Password"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
      {error && <p className="text-red-600 text-center mt-4">{error}</p>}
    </div>
  );
}

export default RegisterUserForm;
