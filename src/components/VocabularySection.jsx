// src/components/VocabularySection.jsx
import { useState, useEffect } from "react";
import { saveProgress, getProgress, addToVocabulary } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function VocabularySection({ language, user }) {
  const [score, setScore] = useState(0);
  const [wordData, setWordData] = useState(null);
  const [userWords, setUserWords] = useState([]);
  const words = ["hello", "book", "school"];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getProgress(user.uid);
      setScore(progress.vocab || 0);
    };
    const fetchWord = async () => {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${words[currentWord]}`
      );
      const data = await response.json();
      setWordData(data[0]);
    };
    const loadUserWords = async () => {
      const q = query(collection(db, "vocabulary"), where("word", "!=", ""));
      const querySnapshot = await getDocs(q);
      const wordsList = [];
      querySnapshot.forEach((doc) => {
        if (doc.id.startsWith(user.uid)) {
          wordsList.push(doc.data());
        }
      });
      setUserWords(wordsList);
    };
    if (user) {
      loadProgress();
      fetchWord();
      loadUserWords();
    }
  }, [user, currentWord]);

  const nextWord = async () => {
    const newScore = score + 5;
    setScore(newScore);
    setCurrentWord((currentWord + 1) % words.length);
    await saveProgress(user.uid, "vocab", newScore);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        {language === "uz" ? "Lug‘at" : "Vocabulary"}
      </h2>
      <div className="space-y-4">
        {wordData ? (
          <>
            <p className="text-lg">{wordData.word}</p>
            <p>
              {language === "uz"
                ? "Ma’nosi: " +
                  (wordData.meanings[0].definitions[0].definition ||
                    "Topilmadi")
                : "Meaning: " +
                  (wordData.meanings[0].definitions[0].definition ||
                    "Not found")}
            </p>
            {wordData.phonetics[0]?.audio && (
              <button
                onClick={() => new Audio(wordData.phonetics[0].audio).play()}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {language === "uz" ? "Tinglash" : "Listen"}
              </button>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
        <button
          onClick={nextWord}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {language === "uz" ? "Keyingi so‘z" : "Next word"}
        </button>
        <p>{language === "uz" ? `Ballar: ${score}` : `Score: ${score}`}</p>
        <h3 className="text-xl font-semibold mt-4">
          {language === "uz" ? "Sizning so‘zlaringiz" : "Your Words"}
        </h3>
        <ul className="list-disc pl-5">
          {userWords.map((item, index) => (
            <li key={index}>
              <strong>{item.word}</strong>: {item.definition}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default VocabularySection;
