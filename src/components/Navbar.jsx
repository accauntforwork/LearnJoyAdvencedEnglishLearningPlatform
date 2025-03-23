// src/components/Navbar.jsx
import { Link } from "react-router-dom";

function Navbar({ language, toggleLanguage, user, handleLogout }) {
  return (
    <nav className="bg-blue-600 p-4 text-white flex flex-wrap justify-between items-center">
      <h1 className="text-xl font-bold">
        {language === "uz"
          ? "Ingliz Tili Platformasi"
          : "English Learning Platform"}
      </h1>
      {user && (
        <div className="flex flex-wrap space-x-4 items-center">
          <Link to="/" className="hover:underline">
            {language === "uz" ? "Statistika" : "Dashboard"}
          </Link>
          <Link to="/grammar" className="hover:underline">
            {language === "uz" ? "Grammatika" : "Grammar"}
          </Link>
          <Link to="/vocabulary" className="hover:underline">
            {language === "uz" ? "Lug‘at" : "Vocabulary"}
          </Link>
          <Link to="/listening" className="hover:underline">
            {language === "uz" ? "Tinglash" : "Listening"}
          </Link>
          <Link to="/reading" className="hover:underline">
            {language === "uz" ? "O‘qish" : "Reading"}
          </Link>
          <Link to="/speaking" className="hover:underline">
            {language === "uz" ? "Nutqiy ko‘nikmalar" : "Speaking"}
          </Link>
        </div>
      )}
      <div className="flex space-x-4 items-center">
        <button
          onClick={toggleLanguage}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
        >
          {language === "uz" ? "English" : "O‘zbekcha"}
        </button>
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            {language === "uz" ? "Chiqish" : "Logout"}
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
