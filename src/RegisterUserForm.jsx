import { useState } from "react";

function RegisterUserForm() {
  const [userFormData, setUserFormData] = useState({ name: "", email: "", id: "" });

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
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userFormData.name, email: userFormData.email }),
      });
      const data = await response.json();
      setUserFormData((prevValue) => ({
        ...prevValue,
        id: data.user.id,
      }));
      console.log("Registration successful:", data);
    } catch (error) {
      setError("Registration failed");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Register User</h1>
      {userFormData.id && (
        <p>Hello {userFormData.name}, ID: {userFormData.id}, registered successfully!</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          onChange={handleInputChange}
          value={userFormData.name}
          placeholder="Name"
        />

        <input
          name="email"
          onChange={handleInputChange}
          value={userFormData.email}
          placeholder="Email"
        />

        <button type="submit">Register</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default RegisterUserForm;
