import { useState } from "react"; // You need to import useState
import axios from "axios";

export default function App() {
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [message, setMessage] = useState(""); // State for the message

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          email, // Pass email and password in the request payload
          password,
        }
      );
      setMessage("Login successful!"); // Set message on successful login
      console.log(response.data); // Handle the response
    } catch (error) {
      setMessage("Login failed. Please try again."); // Set message on error
      console.log(error); // Handle error
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/logout"
      );
      setMessage("Logout successful!"); // Set message on successful logout
      console.log(response.data); // Handle the response
    } catch (error) {
      setMessage("Logout failed. Please try again."); // Set message on error
      console.log(error); // Handle error
    }
  };

  return (
    <div>
      <h1>App</h1>
      {message && <p>{message}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)} // Set email value
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} // Set password value
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Login</button>
    </div>
  );
}
