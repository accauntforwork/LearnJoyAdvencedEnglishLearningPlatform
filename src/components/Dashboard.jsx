import { useState, useEffect } from "react";
import { getProgress } from "../firebase";

function Dashboard({ language, user }) {
  const [progress, setProgress] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setError(
          language === "uz"
            ? "Iltimos, tizimga kiring!"
            : "Please log in to continue!"
        );
        setLoading(false);
        return;
      }

      try {
        const userProgress = await getProgress(user.uid);

        const normalizedProgress = {};
        let readingScore = 0;

        if (userProgress && typeof userProgress === "object") {
          Object.keys(userProgress).forEach((key) => {
            const lowerKey = key.toLowerCase();

            if (lowerKey.startsWith("reading")) {
              readingScore += userProgress[key];
            } else {
              normalizedProgress[lowerKey] = userProgress[key] || 0;
            }
          });

          if (readingScore > 0) {
            normalizedProgress["reading"] = readingScore;
          }
        }

        setProgress(normalizedProgress);
      } catch (err) {
        console.error("Error loading progress:", err);
        setError(
          language === "uz"
            ? "Progressni yuklashda xatolik yuz berdi!"
            : "Error loading progress!"
        );
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, [user, language]);

  const sections = [
    { key: "vocabulary", name: language === "uz" ? "Lug‘at" : "Vocabulary" },
    { key: "listening", name: language === "uz" ? "Eshitish" : "Listening" },
    { key: "reading", name: language === "uz" ? "O‘qish" : "Reading" },
    { key: "speaking", name: language === "uz" ? "Gapirish" : "Speaking" },
    { key: "writing", name: language === "uz" ? "Yozish" : "Writing" },
  ];

  const totalScore = sections.reduce(
    (sum, section) => sum + (progress[section.key] || 0),
    0
  );

  if (loading || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
        <div className="backdrop-blur-lg bg-white/60 p-6 rounded-xl shadow-xl max-w-md w-full">
          <p className="text-center text-lg text-gray-700">
            {loading
              ? language === "uz"
                ? "Yuklanmoqda..."
                : "Loading..."
              : error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen  py-10 px-4">
      <div className="max-w-4xl mx-auto backdrop-blur-lg bg-white/70 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
          {language === "uz" ? "Boshqaruv paneli" : "Dashboard"}
        </h2>
        <h3 className="text-xl text-gray-700 mb-6 text-center">
          {language === "uz" ? "Sizning natijalaringiz:" : "Your Progress:"}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <th className="p-3">
                  {language === "uz" ? "Bo‘lim" : "Section"}
                </th>
                <th className="p-3">{language === "uz" ? "Ball" : "Score"}</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section, index) => (
                <tr
                  key={section.key}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-100 transition`}
                >
                  <td className="p-3 text-gray-800">{section.name}</td>
                  <td className="p-3 text-indigo-600 font-semibold">
                    {progress[section.key] || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xl font-semibold text-gray-800">
            {language === "uz" ? "Umumiy ball:" : "Total Score:"}
          </p>
          <div className="inline-block mt-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-full shadow-md">
            {totalScore}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
