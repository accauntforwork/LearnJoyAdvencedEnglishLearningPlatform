import React, { useState } from "react";
import ReadingPart1 from "./ReadingPart1";
import ComingSoon from "./ComingSoon";

function ReadingSection({ language, user }) {
  const [selectedPart, setSelectedPart] = useState(1);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {language === "uz" ? "Reading bo‘limi" : "Reading Section"}
      </h2>

      {/* Partlar tugmalari */}
      <div className="flex gap-3 mb-6">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => setSelectedPart(num)}
            className={`px-4 py-2 rounded-lg ${
              selectedPart === num
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {language === "uz" ? `${num}-qism` : `Part ${num}`}
          </button>
        ))}
      </div>

      {/* Har bir part uchun alohida component */}
      {selectedPart === 1 && <ReadingPart1 language={language} user={user} />}
      {selectedPart > 1 && (
        <ComingSoon part={selectedPart} language={language} />
      )}
    </div>
  );
}

export default ReadingSection;
