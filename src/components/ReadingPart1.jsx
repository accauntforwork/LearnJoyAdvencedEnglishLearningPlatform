import React, { useEffect, useState } from "react";
import readingData from "../data/readingPart1.json";
import axios from "axios";

function ReadingPart1({ language, user }) {
  const [selectedTextId, setSelectedTextId] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [vocabWord, setVocabWord] = useState("");
  const [vocabResult, setVocabResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Score saqlash localStorage orqali
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("readingScores") || "{}");
    if (user && selectedTextId && stored[`${user}_${selectedTextId}`]) {
      setScore(stored[`${user}_${selectedTextId}`]);
    }
  }, [user, selectedTextId]);

  const handleTextSelect = (e) => {
    setSelectedTextId(e.target.value);
    setUserAnswers({});
    setScore(null);
  };

  const handleInputChange = (index, value) => {
    setUserAnswers({ ...userAnswers, [index]: value });
  };

  const handleCheckAnswers = () => {
    const selectedText = readingData.find((t) => t.id === selectedTextId);
    if (!selectedText) return;

    let correctCount = 0;
    selectedText.blanks.forEach((blank, idx) => {
      if (
        userAnswers[idx] &&
        userAnswers[idx].trim().toLowerCase() === blank.correct.toLowerCase()
      ) {
        correctCount++;
      }
    });

    const newScore = correctCount * 10;
    setScore(newScore);

    const stored = JSON.parse(localStorage.getItem("readingScores") || "{}");
    stored[`${user}_${selectedTextId}`] = newScore;
    localStorage.setItem("readingScores", JSON.stringify(stored));
  };

  const handleVocabLookup = async (word) => {
    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      setVocabResult(response.data[0]);
      setShowModal(true);
    } catch (error) {
      setVocabResult({ error: "Word not found" });
      setShowModal(true);
    }
  };

  const selectedText = readingData.find((t) => t.id === selectedTextId);

  return (
    <div className="p-4 bg-white shadow rounded-xl">
      {/* Matn tanlash */}
      <label className="block mb-3 font-medium">
        {language === "uz" ? "Matnni tanlang" : "Select a passage"}:
      </label>
      <select
        className="p-2 border rounded mb-5 w-full"
        onChange={handleTextSelect}
        value={selectedTextId}
      >
        <option value="">
          {language === "uz" ? "Matn tanlang" : "Choose a passage"}
        </option>
        {readingData.map((text) => (
          <option key={text.id} value={text.id}>
            {text.title}
          </option>
        ))}
      </select>

      {/* Matn va blanklar */}
      {selectedText && (
        <div>
          <p className="text-lg font-semibold mb-3">
            {language === "uz" ? "Gapni to‘ldiring" : "Fill in the blank"}:
          </p>
          <p className="mb-4">
            {selectedText.text.split("___").map((part, idx, arr) => (
              <span key={idx}>
                {part}
                {idx < arr.length - 1 && (
                  <input
                    type="text"
                    className="border-b-2 border-gray-500 mx-2 w-24"
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    value={userAnswers[idx] || ""}
                  />
                )}
              </span>
            ))}
          </p>

          {/* Natija tugmasi */}
          <button
            onClick={handleCheckAnswers}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {language === "uz" ? "Natijani ko‘rish" : "Check Answers"}
          </button>

          {/* Vocabulary input */}
          <div className="mt-6">
            <label className="block mb-1 font-medium">
              {language === "uz" ? "So‘z ma‘nosi:" : "Word Meaning:"}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={vocabWord}
                onChange={(e) => setVocabWord(e.target.value)}
                placeholder={
                  language === "uz" ? "So‘zni yozing" : "Enter a word"
                }
                className="p-2 border rounded w-full"
              />
              <button
                onClick={() => handleVocabLookup(vocabWord)}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                {language === "uz" ? "Ko‘rish" : "Lookup"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Score ko‘rsatish */}
      {score !== null && (
        <p className="mt-5 text-xl font-semibold text-blue-700">
          {language === "uz" ? "Sizning balingiz:" : "Your score"} {score}/100
        </p>
      )}

      {/* Vocabulary modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            {vocabResult?.word ? (
              <div>
                <h2 className="text-xl font-bold mb-2">{vocabResult.word}</h2>
                <p className="italic text-gray-700 mb-2">
                  {vocabResult.phonetic}
                </p>
                {vocabResult.meanings?.map((meaning, i) => (
                  <div key={i} className="mb-3">
                    <h4 className="font-semibold">{meaning.partOfSpeech}</h4>
                    <ul className="list-disc list-inside text-sm">
                      {meaning.definitions.map((def, j) => (
                        <li key={j}>{def.definition}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-600">{vocabResult?.error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadingPart1;
