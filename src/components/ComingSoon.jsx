// src/components/ComingSoon.jsx
import React from "react";

function ComingSoon({ part, language }) {
  return (
    <div className="p-6 bg-yellow-100 border-l-4 border-yellow-500 rounded">
      <h3 className="text-xl font-semibold text-yellow-700">
        {language === "uz"
          ? `${part}-qism tez orada qo‘shiladi`
          : `Part ${part} coming soon`}
      </h3>
      <p className="text-gray-800 mt-2">
        {language === "uz"
          ? "Iltimos, keyinroq qaytib o‘ting."
          : "Please check back later."}
      </p>
    </div>
  );
}

export default ComingSoon;
