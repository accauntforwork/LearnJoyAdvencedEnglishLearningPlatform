// src/components/ReadingSection.jsx
import { useState } from "react";
import ReadingPart1 from "./ReadingPart1";

function ReadingSection({ language, user }) {
  const [selectedPart, setSelectedPart] = useState(1);

  const parts = [
    { id: 1, name: language === "uz" ? "1-qism" : "Part 1" },
    { id: 2, name: language === "uz" ? "2-qism" : "Part 2" },
    { id: 3, name: language === "uz" ? "3-qism" : "Part 3" },
    { id: 4, name: language === "uz" ? "4-qism" : "Part 4" },
    { id: 5, name: language === "uz" ? "5-qism" : "Part 5" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        {language === "uz" ? "O‘qish" : "Reading"}
      </h2>
      <div className="flex space-x-4 mb-4">
        {parts.map((part) => (
          <button
            key={part.id}
            onClick={() => setSelectedPart(part.id)}
            className={`px-4 py-2 rounded ${
              selectedPart === part.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {part.name}
          </button>
        ))}
      </div>
      {selectedPart === 1 && <ReadingPart1 language={language} user={user} />}
      {/* Keyingi partlar qo‘shilganda shu yerga qo‘shiladi */}
      {/* Masalan: {selectedPart === 2 && <ReadingPart2 language={language} user={user} />} */}
    </div>
  );
}

export default ReadingSection;
