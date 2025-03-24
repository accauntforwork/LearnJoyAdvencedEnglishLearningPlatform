// // src/components/Navbar.jsx
// import { Link } from "react-router-dom";

// function Navbar({ language, toggleLanguage, user, handleLogout }) {
//   return (
//     <nav className="bg-blue-600 p-4 text-white flex flex-wrap justify-between items-center">
//       <h1 className="text-xl font-bold">
//         {language === "uz"
//           ? "Ingliz Tili Platformasi"
//           : "English Learning Platform"}
//       </h1>
//       {user && (
//         <div className="flex flex-wrap space-x-4 items-center">
//           <Link to="/" className="hover:underline">
//             {language === "uz" ? "Statistika" : "Dashboard"}
//           </Link>
//           <Link to="/grammar" className="hover:underline">
//             {language === "uz" ? "Grammatika" : "Grammar"}
//           </Link>
//           <Link to="/vocabulary" className="hover:underline">
//             {language === "uz" ? "Lug‘at" : "Vocabulary"}
//           </Link>
//           <Link to="/listening" className="hover:underline">
//             {language === "uz" ? "Tinglash" : "Listening"}
//           </Link>
//           <Link to="/reading" className="hover:underline">
//             {language === "uz" ? "O‘qish" : "Reading"}
//           </Link>
//           <Link to="/speaking" className="hover:underline">
//             {language === "uz" ? "Nutqiy ko‘nikmalar" : "Speaking"}
//           </Link>
//         </div>
//       )}
//       <div className="flex space-x-4 items-center">
//         <button
//           onClick={toggleLanguage}
//           className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
//         >
//           {language === "uz" ? "English" : "O‘zbekcha"}
//         </button>
//         {user && (
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//           >
//             {language === "uz" ? "Chiqish" : "Logout"}
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar({ language, toggleLanguage, user, handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold mr-10">
        {language === "uz" ? "LearnJoy" : "LearnJoy"}
      </h1>

      {/* Hamburger menu button (small screens) */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } absolute top-16 left-0 w-full flex justify-between bg-blue-600 md:static md:flex md:items-center md:space-x-4 flex-col md:flex-row text-center md:text-left`}
      >
        {user && (
          <div className="flex flex-col md:flex-row md:space-x-4">
            <Link to="/" className="p-2 hover:bg-blue-500">
              {language === "uz" ? "Statistika" : "Dashboard"}
            </Link>
            <Link to="/writing" className="p-2 hover:bg-blue-500">
              {language === "uz" ? "Yozish" : "Writing"}
            </Link>
            <Link to="/listening" className="p-2 hover:bg-blue-500">
              {language === "uz" ? "Tinglash" : "Listening"}
            </Link>
            <Link to="/reading" className="p-2 hover:bg-blue-500">
              {language === "uz" ? "O‘qish" : "Reading"}
            </Link>
            <Link to="/speaking" className="p-2 hover:bg-blue-500">
              {language === "uz" ? "Nutqiy" : "Speaking"}
            </Link>
            <Link to="/grammar" className="p-2 hover:bg-blue-500">
              {language === "uz" ? "Grammatika" : "Grammar"}
            </Link>
            <Link to="/vocabulary" className="p-2 hover:bg-blue-500">
              {language === "uz" ? "Lug‘at" : "Vocabulary"}
            </Link>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:space-x-4 p-2">
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
      </div>
    </nav>
  );
}

export default Navbar;
