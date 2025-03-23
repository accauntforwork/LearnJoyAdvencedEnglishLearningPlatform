// src/components/Register.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Register({ language }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login");
    } catch (err) {
      // Xatolik xabarini tahlil qilish
      let errorMessage = "";
      switch (err.code) {
        case "auth/weak-password":
          errorMessage =
            language === "uz"
              ? "Parol kamida 6 belgidan iborat bo‘lishi kerak!"
              : "Password should be at least 6 characters!";
          break;
        case "auth/email-already-in-use":
          errorMessage =
            language === "uz"
              ? "Bu email allaqachon ishlatilgan!"
              : "This email is already in use!";
          break;
        case "auth/invalid-email":
          errorMessage =
            language === "uz"
              ? "Noto‘g‘ri email formati!"
              : "Invalid email format!";
          break;
        case "auth/missing-email":
          errorMessage =
            language === "uz" ? "Email kiritilmagan!" : "Email is missing!";
          break;
        default:
          errorMessage =
            language === "uz"
              ? "Noma’lum xatolik yuz berdi!"
              : "An unknown error occurred!";
          console.error("Registration error:", err.message); // Konsol uchun log
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        {language === "uz" ? "Ro‘yxatdan o‘tish" : "Register"}
      </h2>
      <form onSubmit={handleRegister} className="space-y-4">
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
          {language === "uz" ? "Ro‘yxatdan o‘tish" : "Register"}
        </button>
      </form>
      <p className="mt-4 text-center">
        {language === "uz" ? "Akkauntingiz bormi?" : "Already have an account?"}{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-blue-500 underline"
        >
          {language === "uz" ? "Kirish" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default Register;
