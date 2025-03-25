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

// //------------------------------------------------------------------------------------------
// import { useState, useEffect } from "react";
// import {
//   saveProgress,
//   getProgress,
//   addToVocabulary,
//   removeFromVocabulary,
// } from "../firebase";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "../firebase";

// function VocabularySection({ language, user }) {
//   const [score, setScore] = useState(0);
//   const [wordData, setWordData] = useState(null);
//   const [userWords, setUserWords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Predefined words list with more comprehensive vocabulary
//   const words = [
//     "hello",
//     "book",
//     "school",
//     "learn",
//     "computer",
//     "language",
//     "travel",
//     "music",
//     "friend",
//     "happy",
//   ];
//   const [currentWord, setCurrentWord] = useState(0);

//   // Fetch word data and user progress
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user) return;

//       setLoading(true);
//       try {
//         // Load progress
//         const progress = await getProgress(user.uid);
//         setScore(progress.vocab || 0);

//         // Fetch word definition
//         const response = await fetch(
//           `https://api.dictionaryapi.dev/api/v2/entries/en/${words[currentWord]}`
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch word definition");
//         }

//         const data = await response.json();
//         setWordData(data[0]);

//         // Load user's vocabulary words
//         const q = query(
//           collection(db, "vocabulary"),
//           where("userId", "==", user.uid)
//         );
//         const querySnapshot = await getDocs(q);
//         const wordsList = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setUserWords(wordsList);

//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user, currentWord]);

//   // Add current word to vocabulary
//   const addCurrentWordToVocabulary = async () => {
//     if (!wordData || !user) return;

//     try {
//       const definition =
//         wordData.meanings[0]?.definitions[0]?.definition ||
//         "No definition available";
//       await addToVocabulary(user.uid, wordData.word, definition);

//       // Update local state
//       const newWord = {
//         word: wordData.word,
//         definition,
//         userId: user.uid,
//       };
//       setUserWords((prev) => [...prev, newWord]);

//       // Increase score
//       const newScore = score + 5;
//       setScore(newScore);
//       await saveProgress(user.uid, "vocab", newScore);
//     } catch (err) {
//       setError("Failed to add word to vocabulary");
//     }
//   };

//   // Remove word from vocabulary
//   const removeWordFromVocabulary = async (wordId) => {
//     try {
//       await deleteDoc(doc(db, "vocabulary", wordId));

//       // Update local state
//       setUserWords((prev) => prev.filter((word) => word.id !== wordId));

//       // Decrease score
//       const newScore = Math.max(0, score - 2);
//       setScore(newScore);
//       await saveProgress(user.uid, "vocab", newScore);
//     } catch (err) {
//       setError("Failed to remove word from vocabulary");
//     }
//   };

//   // Navigate to next word
//   const nextWord = () => {
//     setCurrentWord((prev) => (prev + 1) % words.length);
//   };

//   // Render word details
//   const renderWordDetails = () => {
//     if (loading) return <p>Loading...</p>;
//     if (error) return <p className="text-red-500">{error}</p>;
//     if (!wordData) return null;

//     return (
//       <div className="space-y-4">
//         <div className="bg-gray-100 p-4 rounded-lg">
//           <h3 className="text-xl font-bold mb-2">{wordData.word}</h3>

//           {/* Part of Speech */}
//           <p className="text-gray-600 mb-2">
//             {language === "uz" ? "Qism: " : "Part of Speech: "}
//             {wordData.meanings[0]?.partOfSpeech || "N/A"}
//           </p>

//           {/* Definition */}
//           <p>
//             {language === "uz" ? "Ma'nosi: " : "Meaning: "}
//             {wordData.meanings[0]?.definitions[0]?.definition ||
//               "No definition found"}
//           </p>

//           {/* Phonetics */}
//           {wordData.phonetics?.[0]?.audio && (
//             <button
//               onClick={() => new Audio(wordData.phonetics[0].audio).play()}
//               className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//             >
//               {language === "uz" ? "Tinglash" : "Listen"}
//             </button>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex space-x-4">
//           <button
//             onClick={addCurrentWordToVocabulary}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             {language === "uz" ? "Lug'atga qo'shish" : "Add to Vocabulary"}
//           </button>
//           <button
//             onClick={nextWord}
//             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//           >
//             {language === "uz" ? "Keyingi so'z" : "Next Word"}
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // Render user's vocabulary list
//   const renderUserVocabulary = () => {
//     if (userWords.length === 0) {
//       return (
//         <p>
//           {language === "uz"
//             ? "Sizning lug'at roʻyxatingiz boʻsh"
//             : "Your vocabulary list is empty"}
//         </p>
//       );
//     }

//     return (
//       <div className="mt-6">
//         <h3 className="text-xl font-semibold mb-4">
//           {language === "uz" ? "Sizning so'zlaringiz" : "Your Words"}
//         </h3>
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2 text-left">
//                 {language === "uz" ? "So'z" : "Word"}
//               </th>
//               <th className="border p-2 text-left">
//                 {language === "uz" ? "Ma'no" : "Meaning"}
//               </th>
//               <th className="border p-2 text-center">
//                 {language === "uz" ? "Amallar" : "Actions"}
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {userWords.map((item) => (
//               <tr key={item.id} className="hover:bg-gray-100">
//                 <td className="border p-2 font-bold">{item.word}</td>
//                 <td className="border p-2">{item.definition}</td>
//                 <td className="border p-2 text-center">
//                   <button
//                     onClick={() => removeWordFromVocabulary(item.id)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     {language === "uz" ? "O'chirish" : "Remove"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-semibold">
//           {language === "uz" ? "Lug'at" : "Vocabulary"}
//         </h2>
//         <p className="text-lg font-medium">
//           {language === "uz" ? `Ballar: ${score}` : `Score: ${score}`}
//         </p>
//       </div>

//       {renderWordDetails()}
//       {renderUserVocabulary()}
//     </div>
//   );
// }

// export default VocabularySection;
