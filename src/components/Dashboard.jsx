// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import { getProgress } from "../firebase";

function Dashboard({ language, user }) {
  const [progress, setProgress] = useState({
    grammar: 0,
    vocab: 0,
    listening: 0,
    reading: 0,
    speaking: 0,
  });

  useEffect(() => {
    const loadProgress = async () => {
      const data = await getProgress(user.uid);
      setProgress({
        grammar: data.grammar || 0,
        vocab: data.vocab || 0,
        listening: data.listening || 0,
        reading: data.reading || 0,
        speaking: data.speaking || 0,
      });
    };
    if (user) loadProgress();
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {language === "uz"
          ? `Xush kelibsiz, ${user.username}!`
          : `Welcome, ${user.username}!`}
      </h1>
      <h2 className="text-2xl font-semibold">
        {language === "uz" ? "Sizning statistikangiz" : "Your Statistics"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">
            {language === "uz" ? "Grammatika" : "Grammar"}
          </h3>
          <p>
            {language === "uz"
              ? `Ballar: ${progress.grammar}`
              : `Score: ${progress.grammar}`}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">
            {language === "uz" ? "Lug‘at" : "Vocabulary"}
          </h3>
          <p>
            {language === "uz"
              ? `Ballar: ${progress.vocab}`
              : `Score: ${progress.vocab}`}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">
            {language === "uz" ? "Tinglash" : "Listening"}
          </h3>
          <p>
            {language === "uz"
              ? `Ballar: ${progress.listening}`
              : `Score: ${progress.listening}`}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">
            {language === "uz" ? "O‘qish" : "Reading"}
          </h3>
          <p>
            {language === "uz"
              ? `Ballar: ${progress.reading}`
              : `Score: ${progress.reading}`}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">
            {language === "uz" ? "Nutqiy ko‘nikmalar" : "Speaking"}
          </h3>
          <p>
            {language === "uz"
              ? `Ballar: ${progress.speaking}`
              : `Score: ${progress.speaking}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
