// src/components/ListeningSection.jsx
import { useState, useEffect } from "react";
import { saveProgress, getProgress } from "../firebase";

function ListeningSection({ language, user }) {
  const [score, setScore] = useState(0);
  const audioFiles = [
    {
      src: "/assets/audio/dialog1.mp3",
      question: "What is the dialogue about?",
    },
    { src: "/assets/audio/dialog2.mp3", question: "Who is speaking?" },
  ];
  const [currentAudio, setCurrentAudio] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getProgress(user.uid);
      setScore(progress.listening || 0);
    };
    if (user) loadProgress();
  }, [user]);

  const nextAudio = async () => {
    const newScore = score + 10;
    setScore(newScore);
    setCurrentAudio((currentAudio + 1) % audioFiles.length);
    await saveProgress(user.uid, "listening", newScore);
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        {language === "uz" ? "Tinglash" : "Listening"}
      </h2>
      <div className="space-y-4">
        <audio controls className="w-full">
          <source src={audioFiles[currentAudio].src} type="audio/mp3" />
        </audio>
        <p>
          {language === "uz" ? "Savol: " : "Question: "}{" "}
          {audioFiles[currentAudio].question}
        </p>
        <button
          onClick={nextAudio}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {language === "uz" ? "Keyingi" : "Next"}
        </button>
        <p>{language === "uz" ? `Ballar: ${score}` : `Score: ${score}`}</p>
      </div>
    </section>
  );
}

export default ListeningSection;
