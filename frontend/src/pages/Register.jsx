import { useState } from "react";
import API from "../api";

function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setMessage("");

      const response = await API.post("/auth/register", {
        username: name,
        email: email,
        password: password,
        role: "user",
      });

      console.log(
        "REGISTRATION SUCCESS:",
        response.data
      );

      setMessage(
        "Registration successful! Redirecting to Login..."
      );

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        setPage("login");
      }, 800);

    } catch (error) {
      console.log(
        "REGISTRATION ERROR:",
        error.response?.data
      );

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        setMessage(
          detail
            .map((item) => item.msg)
            .join(", ")
        );
      } else {
        setMessage(
          detail ||
            "Registration failed. Please try again."
        );
      }
    }
  };

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleRegister}>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Create Account
        </button>

      </form>

      {message && (
        <p>{message}</p>
      )}
    </div>
  );
}

export default Register;