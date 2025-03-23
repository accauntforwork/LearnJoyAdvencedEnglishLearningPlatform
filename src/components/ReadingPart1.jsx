import { useState, useEffect } from "react";
import { saveProgress, getProgress, addToVocabulary } from "../firebase";
import readingPart1 from "../data/readingPart1.json";

function ReadingPart1({ language, user }) {
  const [scores, setScores] = useState({}); // Har bir matn uchun ballar
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);
  const [wordDefinition, setWordDefinition] = useState(null);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [showTextList, setShowTextList] = useState(true); // Ro‘yxatni ko‘rsatish holati

  // Progressni yuklash
  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        const progress = await getProgress(user.uid);
        setScores(progress || {});
      }
    };
    loadProgress();
  }, [user]);

  // Birinchi matnni avtomatik tanlash
  useEffect(() => {
    if (readingPart1 && readingPart1.length > 0 && !selectedTextId) {
      setSelectedTextId(readingPart1[0].id);
      setAnswers((prev) => ({
        ...prev,
        [readingPart1[0].id]: new Array(readingPart1[0].blanks.length).fill(""),
      }));
    }
  }, []);

  // Tanlangan matnni olish
  const selectedText =
    readingPart1.find((text) => text.id === selectedTextId) || {};

  // Input o‘zgarishlarini boshqarish
  const handleInputChange = (e, index) => {
    const newAnswers = { ...answers };
    newAnswers[selectedTextId] = [...(newAnswers[selectedTextId] || [])];
    newAnswers[selectedTextId][index] = e.target.value;
    setAnswers(newAnswers);
  };

  // Matnni render qilish
  const renderText = () => {
    if (!selectedText || !selectedText.text || !selectedText.blanks)
      return null;
    const words = selectedText.text.split(" ");
    let blankIndex = 0;

    return words.map((word, i) => {
      if (word === "___" && blankIndex < selectedText.blanks.length) {
        const index = blankIndex++;
        return (
          <input
            key={`blank-${index}`}
            type="text"
            value={answers[selectedTextId]?.[index] || ""}
            onChange={(e) => handleInputChange(e, index)}
            className="border p-1 rounded w-24 mx-1 inline-block"
            placeholder={language === "uz" ? "So‘z kiriting" : "Enter word"}
          />
        );
      } else {
        return (
          <span
            key={`word-${i}`}
            onClick={() => fetchDefinition(word)}
            className="cursor-pointer hover:bg-yellow-200 mx-1"
          >
            {word}
          </span>
        );
      }
    });
  };

  // So‘z ma’nosini olish
  const fetchDefinition = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = await response.json();
      if (data[0]) {
        const definition = data[0].meanings[0].definitions[0].definition;
        setSelectedWord(word);
        setWordDefinition(definition);
        await addToVocabulary(user.uid, word, definition);
      }
    } catch (err) {
      setWordDefinition(
        language === "uz" ? "Ma’no topilmadi" : "Definition not found"
      );
    }
  };

  // Testni tekshirish
  const finishTest = async () => {
    if (!selectedText || !selectedText.blanks) return;
    const currentAnswers = answers[selectedTextId] || [];
    let correctCount = 0;

    currentAnswers.forEach((answer, i) => {
      if (
        answer &&
        selectedText.blanks[i] &&
        answer.toLowerCase() === selectedText.blanks[i].correct.toLowerCase()
      ) {
        correctCount++;
      }
    });

    const newScore =
      (scores[`reading_${selectedTextId}`] || 0) + correctCount * 10;
    setScores((prev) => ({
      ...prev,
      [`reading_${selectedTextId}`]: newScore,
    }));
    setFeedback(
      language === "uz"
        ? `Test yakunlandi! To‘g‘ri javoblar: ${correctCount}/${selectedText.blanks.length}`
        : `Test finished! Correct answers: ${correctCount}/${selectedText.blanks.length}`
    );
    await saveProgress(user.uid, `reading_${selectedTextId}`, newScore);
  };

  // Matnni tanlash
  const handleTextSelect = (textId) => {
    setSelectedTextId(textId);
    setFeedback("");
    setShowTextList(false); // Matn tanlanganda ro‘yxatni yashirish
    if (!answers[textId]) {
      const text = readingPart1.find((t) => t.id === textId);
      setAnswers((prev) => ({
        ...prev,
        [textId]: new Array(text.blanks.length).fill(""),
      }));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">
        {language === "uz"
          ? "1-qism: Matnni to‘ldirish"
          : "Part 1: Fill in the blanks"}
      </h3>

      {/* Matnlar ro‘yxati */}
      {showTextList ? (
        <div className="mb-4">
          <h4 className="text-lg font-semibold">
            {language === "uz" ? "Matnni tanlang:" : "Select a text:"}
          </h4>
          <ul className="list-disc pl-5">
            {readingPart1 && readingPart1.length > 0 ? (
              readingPart1.map((text) => (
                <li
                  key={text.id}
                  onClick={() => handleTextSelect(text.id)}
                  className={`cursor-pointer py-1 ${
                    selectedTextId === text.id
                      ? "text-blue-600 font-bold"
                      : "hover:text-blue-500"
                  }`}
                >
                  {text.title}{" "}
                  {scores[`reading_${text.id}`]
                    ? `(${scores[`reading_${text.id}`]} ball)`
                    : ""}
                </li>
              ))
            ) : (
              <p>
                {language === "uz" ? "Matnlar topilmadi" : "No texts found"}
              </p>
            )}
          </ul>
        </div>
      ) : (
        <>
          {/* Tanlangan matn */}
          <p className="leading-loose">{renderText()}</p>
          <div className="space-x-4">
            <button
              onClick={finishTest}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {language === "uz" ? "Tugatish" : "Finish"}
            </button>
            <button
              onClick={() => setShowTextList(true)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              {language === "uz" ? "Matnlarga qaytish" : "Back to Texts"}
            </button>
          </div>
          {feedback && <p className="text-lg">{feedback}</p>}
          <p>
            {language === "uz"
              ? `Ballar (${selectedText.title}): ${
                  scores[`reading_${selectedTextId}`] || 0
                }`
              : `Score (${selectedText.title}): ${
                  scores[`reading_${selectedTextId}`] || 0
                }`}
          </p>
        </>
      )}

      {/* Popup oynasi */}
      {selectedWord && wordDefinition && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-50">
          <h4 className="text-lg font-semibold">
            {language === "uz" ? "So‘z: " : "Word: "} {selectedWord}
          </h4>
          <p>
            {language === "uz" ? "Ma’no: " : "Definition: "} {wordDefinition}
          </p>
          <button
            onClick={() => {
              setSelectedWord(null);
              setWordDefinition(null);
            }}
            className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            {language === "uz" ? "Yopish" : "Close"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ReadingPart1;
