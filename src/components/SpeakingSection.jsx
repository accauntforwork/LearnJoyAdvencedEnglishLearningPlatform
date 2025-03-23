// src/components/SpeakingSection.jsx
import { useState, useEffect } from "react";
import { saveProgress, getProgress } from "../firebase";
import speakingData from "../data/speaking.json";

function SpeakingSection({ language, user }) {
  const [score, setScore] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getProgress(user.uid);
      setScore(progress.speaking || 0);
    };
    if (user) loadProgress();
  }, [user]);

  const nextPrompt = async () => {
    const newScore = score + 10;
    setScore(newScore);
    setCurrentPrompt((currentPrompt + 1) % speakingData.length);
    await saveProgress(user.uid, "speaking", newScore);
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        {language === "uz" ? "Nutqiy ko‘nikmalar" : "Speaking Skills"}
      </h2>
      <div className="space-y-4">
        <p className="text-lg">
          {language === "uz" ? "Savol: " : "Prompt: "}{" "}
          {speakingData[currentPrompt].prompt}
        </p>
        <p>
          {language === "uz" ? "Yordam: " : "Hint: "}{" "}
          {speakingData[currentPrompt].hint}
        </p>
        <button
          onClick={nextPrompt}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {language === "uz" ? "Keyingi" : "Next"}
        </button>
        <p>{language === "uz" ? `Ballar: ${score}` : `Score: ${score}`}</p>
      </div>
    </section>
  );
}

export default SpeakingSection;
