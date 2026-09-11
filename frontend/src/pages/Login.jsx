import { useState } from "react";
import API from "../api";

function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email: email,
        password: password,
      });

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      setMessage("Login successful!");

      setTimeout(() => {
        setPage("dashboard");
      }, 300);

    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Login failed. Please try again."
      );
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <button type="submit">
          Login
        </button>

      </form>

      {message && (
        <p>{message}</p>
      )}

    </div>
  );
}

export default Login;