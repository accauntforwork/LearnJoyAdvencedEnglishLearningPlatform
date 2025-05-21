// src/components/ReadingPart2.jsx
import { useState, useEffect } from "react";
import { saveProgress, getProgress } from "../firebase";
import readingData from "../data/readingPart2.json";

function ReadingPart2({ language, user }) {
  const [texts, setTexts] = useState([]);
  const [statements, setStatements] = useState([]);
  const [selectedStatements, setSelectedStatements] = useState([]);
  const [usedStatements, setUsedStatements] = useState([]);
  const [scores, setScores] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);
  const [wordDefinition, setWordDefinition] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // JSON faylidan ma'lumotlarni o'qish va state'larni boshlash
  useEffect(() => {
    setTexts(readingData.texts);
    setStatements(readingData.statements);
    setSelectedStatements(Array(readingData.texts.length).fill(""));
    setScores(Array(readingData.texts.length).fill(0));
  }, []);

  // Firestore'dan progressni yuklash
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setError(
          language === "uz"
            ? "Iltimos, tizimga kiring!"
            : "Please log in to continue!"
        );
        return;
      }

      try {
        const progress = await getProgress(user.uid);
        if (progress.reading) {
          const newScores = [...scores];
          newScores.forEach((_, index) => {
            newScores[index] = progress.reading / texts.length; // O'rtacha ball
          });
          setScores(newScores);
        }
      } catch (err) {
        setError(
          language === "uz"
            ? "Progressni yuklashda xatolik yuz berdi!"
            : "Error loading progress!"
        );
      }
    };
    loadProgress();
  }, [user, language, scores, texts.length]);

  const handleStatementChange = (textIndex, statementId) => {
    const newSelectedStatements = [...selectedStatements];
    const previouslySelected = newSelectedStatements[textIndex];

    // Agar oldin tanlangan bayonot bo‘lsa, uni `usedStatements` dan olib tashlash
    if (previouslySelected) {
      setUsedStatements(
        usedStatements.filter((id) => id !== previouslySelected)
      );
    }

    // Yangi bayonotni tanlash
    newSelectedStatements[textIndex] = statementId;
    setSelectedStatements(newSelectedStatements);

    // Tanlangan bayonotlarni yangilash
    if (statementId) {
      setUsedStatements([...usedStatements, statementId]);
    }
  };

  const checkAnswer = async (textIndex) => {
    const selectedStatement = selectedStatements[textIndex];
    const correctAnswer = texts[textIndex].correctAnswer;

    if (!selectedStatement) {
      setFeedback(
        language === "uz"
          ? "Iltimos, bayonot tanlang!"
          : "Please select a statement!"
      );
      return;
    }

    if (selectedStatement === correctAnswer) {
      const newScores = [...scores];
      newScores[textIndex] = (newScores[textIndex] || 0) + 10;
      setScores(newScores);

      const totalScore = newScores.reduce(
        (sum, score) => sum + (score || 0),
        0
      );
      if (user) {
        try {
          await saveProgress(user.uid, "reading", totalScore);
          setFeedback(language === "uz" ? "To‘g‘ri!" : "Correct!");
        } catch (err) {
          setError(
            language === "uz"
              ? "Ballarni saqlashda xatolik yuz berdi!"
              : "Error saving score!"
          );
        }
      }
    } else {
      setFeedback(
        language === "uz"
          ? "Noto‘g‘ri! Qayta urinib ko‘ring."
          : "Incorrect! Try again."
      );
    }
  };

  // So'z ta'rifini olish
  const fetchDefinition = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = await response.json();
      if (
        data &&
        data[0] &&
        data[0].meanings &&
        data[0].meanings[0].definitions
      ) {
        setWordDefinition(data[0].meanings[0].definitions[0].definition);
      } else {
        setWordDefinition(
          language === "uz"
            ? "Bu so‘z uchun ta’rif topilmadi."
            : "No definition found for this word."
        );
      }
    } catch (err) {
      setWordDefinition(
        language === "uz"
          ? "Ta’rifni yuklashda xatolik yuz berdi."
          : "Error fetching definition."
      );
    }
  };

  const handleWordClick = (word) => {
    setSelectedWord(word);
    setShowPopup(true);
    fetchDefinition(word);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedWord(null);
    setWordDefinition("");
  };

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (texts.length === 0 || statements.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <p className="text-center">
          {language === "uz" ? "Ma'lumotlar yuklanmoqda..." : "Loading data..."}
        </p>
      </div>
    );
  }

  return (
    <section className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">
        {language === "uz" ? "O‘qish: 2-qism" : "Reading: Part 2"}
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Chap tomon: Matnlar */}
        <div className="w-full md:w-1/2 space-y-4">
          <h3 className="text-lg font-medium">
            {language === "uz" ? "Matnlar" : "Texts"}
          </h3>
          {texts.map((text, index) => (
            <div key={text.id} className="border p-4 rounded-lg">
              <h4 className="font-semibold">{text.title}</h4>
              <p>
                {text.description.split(" ").map((word, i) => (
                  <span
                    key={i}
                    onClick={() =>
                      handleWordClick(word.replace(/[^a-zA-Z]/g, ""))
                    }
                    className="cursor-pointer hover:underline"
                  >
                    {word}{" "}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        {/* O'ng tomon: Bayonotlar va tanlash */}
        <div className="w-full md:w-1/2 space-y-4">
          <h3 className="text-lg font-medium">
            {language === "uz"
              ? "Bayonotlar va javoblar"
              : "Statements and Answers"}
          </h3>
          {texts.map((text, index) => (
            <div key={text.id} className="border p-4 rounded-lg">
              <h4 className="font-semibold">
                {language === "uz"
                  ? `Matn ${text.id} uchun:`
                  : `For Text ${text.id}:`}
              </h4>
              <select
                value={selectedStatements[index] || ""}
                onChange={(e) => handleStatementChange(index, e.target.value)}
                className="border p-2 rounded w-full mt-2"
              >
                <option value="">
                  {language === "uz" ? "Tanlang..." : "Select..."}
                </option>
                {statements.map((statement) => (
                  <option
                    key={statement.id}
                    value={statement.id}
                    disabled={
                      usedStatements.includes(statement.id) &&
                      selectedStatements[index] !== statement.id
                    }
                  >
                    {statement.id}: {statement.text}
                  </option>
                ))}
              </select>
              <button
                onClick={() => checkAnswer(index)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
              >
                {language === "uz" ? "Javobni tekshirish" : "Check Answer"}
              </button>
              <p className="text-lg mt-2">
                {language === "uz"
                  ? `Ballar: ${scores[index] || 0}`
                  : `Score: ${scores[index] || 0}`}
              </p>
            </div>
          ))}
          {feedback && <p className="text-lg mt-2">{feedback}</p>}
        </div>
      </div>

      {/* Pop-up oyna */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-2">
              {language === "uz" ? "So‘z ta’rifi" : "Word Definition"}
            </h3>
            <p className="mb-4">
              <strong>{selectedWord}</strong>: {wordDefinition}
            </p>
            <button
              onClick={closePopup}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              {language === "uz" ? "Yopish" : "Close"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ReadingPart2;
