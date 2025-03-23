// src/components/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Login({ language, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      onLogin({
        username: userCredential.user.email,
        uid: userCredential.user.uid,
      });
      navigate("/");
    } catch (err) {
      setError(
        language === "uz" ? "Noto‘g‘ri ma’lumotlar!" : "Incorrect credentials!"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        {language === "uz" ? "Kirish" : "Login"}
      </h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1">
            {language === "uz" ? "Email" : "Email"}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="example@email.com"
          />
        </div>
        <div>
          <label className="block mb-1">
            {language === "uz" ? "Parol" : "Password"}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder={language === "uz" ? "Parolingiz" : "Your password"}
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {language === "uz" ? "Kirish" : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center">
        {language === "uz" ? "Akkauntingiz yo‘qmi?" : "Don’t have an account?"}{" "}
        <button
          onClick={() => navigate("/register")}
          className="text-blue-500 underline"
        >
          {language === "uz" ? "Ro‘yxatdan o‘tish" : "Register"}
        </button>
      </p>
    </div>
  );
}

export default Login;
