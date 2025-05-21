import { useState, useEffect } from "react";
import { saveProgress, getProgress } from "../firebase";
import Part1Test from "./Part1Test";
import Part2Test from "./Part2Test";

const parts = ["part1", "part2", "part3", "part4", "part5", "part6"];

function ListeningSection({ language, user }) {
  const [activePart, setActivePart] = useState("part1");
  const [activeTest, setActiveTest] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        const progress = await getProgress(user.uid);
        setScore(progress.listening || 0);
      }
    };
    loadProgress();
  }, [user]);

  const updateScore = async (increment) => {
    const newScore = score + increment;
    setScore(newScore);
    if (user) {
      await saveProgress(user.uid, "listening", newScore);
    }
  };

  const renderTestList = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
      {Array.from({ length: 10 }).map((_, idx) => (
        <button
          key={idx}
          className={`border p-2 rounded text-center shadow hover:bg-blue-100 ${
            activeTest === idx ? "bg-blue-500 text-white" : "bg-white"
          }`}
          onClick={() => setActiveTest(idx)}
        >
          Test {idx + 1}
        </button>
      ))}
    </div>
  );

  const renderPartContent = () => {
    if (activeTest === null) return null;

    if (activePart === "part1") {
      return (
        <Part1Test testNumber={activeTest + 1} updateScore={updateScore} />
      );
    }

    if (activePart === "part2") {
      return (
        <Part2Test testNumber={activeTest + 1} updateScore={updateScore} />
      );
    }

    return (
      <div className="text-center text-gray-600 mt-6 text-xl italic">
        {language === "uz" ? "Tez orada tayyor bo‘ladi!" : "Coming soon!"}
      </div>
    );
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {language === "uz" ? "Tinglab tushunish" : "Listening Section"}
      </h2>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {parts.map((part) => (
          <button
            key={part}
            className={`px-4 py-2 rounded-lg border ${
              activePart === part
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                : "bg-gray-100"
            }`}
            onClick={() => {
              setActivePart(part);
              setActiveTest(null);
            }}
          >
            {part.toUpperCase()}
          </button>
        ))}
      </div>

      {renderTestList()}
      {renderPartContent()}

      <p className="mt-6 text-center font-medium text-lg">
        {language === "uz" ? `Umumiy ball: ${score}` : `Total Score: ${score}`}
      </p>
    </section>
  );
}

export default ListeningSection;
