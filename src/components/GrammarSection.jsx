// src/components/GrammarSection.jsx
import { useState, useEffect } from "react";
import { saveProgress, getProgress } from "../firebase";

function GrammarSection({ language, user }) {
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const videoLinks = [
    "https://youtu.be/YfVOEt0NVoA?si=Fxou2OFY4wZO2RBJ", // Misol video (sizning linkingiz bilan almashtiring)
    "https://youtu.be/VZNBjnZyW6s?si=upaNG0LDNUZK6vc3",
  ];

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getProgress(user.uid);
      setScore(progress.grammar || 0);
    };
    if (user) loadProgress();
  }, [user]);

  const checkAnswer = async () => {
    const correctAnswer = "am";
    if (answer.toLowerCase() === correctAnswer) {
      const newScore = score + 10;
      setScore(newScore);
      setFeedback(language === "uz" ? "To‘g‘ri!" : "Correct!");
      await saveProgress(user.uid, "grammar", newScore);
    } else {
      setFeedback(language === "uz" ? "Qayta urinib ko‘ring!" : "Try again!");
    }
  };

  return (
    <section className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        {language === "uz" ? "Grammatika" : "Grammar"}
      </h2>
      <div className="space-y-4">
        <iframe
          width="100%"
          height="315"
          src={videoLinks[0]}
          title="Grammar Lesson"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded"
        ></iframe>
        <p>
          {language === "uz"
            ? "Savol: I ___ a student. (To‘g‘ri so‘zni kiriting)"
            : "Question: I ___ a student. (Enter the correct word)"}
        </p>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder={language === "uz" ? "Javobingiz" : "Your answer"}
        />
        <button
          onClick={checkAnswer}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {language === "uz" ? "Tekshirish" : "Check"}
        </button>
        <p className="text-lg">{feedback}</p>
        <p>{language === "uz" ? `Ballar: ${score}` : `Score: ${score}`}</p>
      </div>
    </section>
  );
}

export default GrammarSection;
