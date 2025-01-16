import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react"; // Import Loader icon

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Static email and password
  const STATIC_EMAIL = "jlt.com";
  const STATIC_PASSWORD = "1234";

  const handleLogin = () => {
    // Check if entered credentials match the static credentials
    if (email === STATIC_EMAIL && password === STATIC_PASSWORD) {
      setIsLoading(true); // Start loading
      const token = "123456789abcdef"; // Mock token for simplicity
      localStorage.setItem("authToken", token); // Store the token in localStorage

      // Simulate a delay (e.g., fetching data, making an API call)
      setTimeout(() => {
        onLogin(); // Notify parent component of successful login
        navigate("/dashboard"); // Redirect to the dashboard
      }, 1500); // 1.5 seconds delay for loading
    } else {
      alert("Invalid email or password!");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(); // Trigger login when Enter key is pressed
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <div className="w-80 bg-white shadow-md rounded-lg p-6">
        <label className="block text-gray-700 font-bold mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={handleKeyPress} // Add key event listener here
        />

        <label className="block text-gray-700 font-bold mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={handleKeyPress} // Add key event listener here
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={isLoading} // Disable button when loading
        >
          Login
        </button>
      </div>

      {/* Full-Screen Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <Loader className="animate-spin text-white" size={50} />
        </div>
      )}
    </div>
  );
};

export default LoginPage;
