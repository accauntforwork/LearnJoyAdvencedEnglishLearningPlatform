// src/components/WritingSection.jsx
import { useState, useEffect } from "react";
import { saveProgress, getProgress } from "../firebase";
import { getFirestore, onSnapshot, doc } from "firebase/firestore"; // Oflayn holatni kuzatish uchun

function WritingSection({ language, user }) {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Xatolik xabari uchun
  const [isOnline, setIsOnline] = useState(true); // Oflayn/online holati

  // Oflayn/online holatini kuzatish
  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(
      doc(db, "progress", user?.uid || "dummy"),
      () => setIsOnline(true),
      (error) => {
        if (error.code === "unavailable") {
          setIsOnline(false);
          setError(
            language === "uz"
              ? "Internet aloqasi yo‘q. Oflayn rejimda ishlayapsiz."
              : "No internet connection. Working in offline mode."
          );
        }
      }
    );
    return () => unsubscribe();
  }, [user, language]);

  // Progressni yuklash
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
        setScore(progress.writing || 0);
      } catch (error) {
        setError(
          language === "uz"
            ? "Progressni yuklashda xatolik yuz berdi!"
            : "Error loading progress!"
        );
      }
    };
    loadProgress();
  }, [user, language]);

  // LanguageTool API orqali tahlil qilish
  const checkWriting = async () => {
    if (!text.trim()) {
      setFeedback([
        {
          message:
            language === "uz"
              ? "Iltimos, matn kiriting!"
              : "Please enter some text!",
        },
      ]);
      return;
    }

    if (!isOnline) {
      setFeedback([
        {
          message:
            language === "uz"
              ? "Internet aloqasi yo‘q. Tahlil qilish uchun onlayn bo‘lishingiz kerak!"
              : "No internet connection. You need to be online to analyze the text!",
        },
      ]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          text: text,
          language: "en-US",
        }),
      });

      const data = await response.json();
      const matches = data.matches || [];

      if (matches.length === 0) {
        setFeedback([
          {
            message:
              language === "uz"
                ? "Ajoyib! Grammatik xatolar topilmadi."
                : "Great! No grammar issues found.",
          },
        ]);
        const newScore = score + 10;
        setScore(newScore);
        if (isOnline) {
          await saveProgress(user.uid, "writing", newScore);
        }
      } else {
        setFeedback(
          matches.map((match) => ({
            message: match.message,
            shortMessage: match.shortMessage,
            replacements: match.replacements.map((r) => r.value),
            context: match.context.text,
            offset: match.offset,
            length: match.length,
          }))
        );
      }
    } catch (error) {
      console.error("Error checking text:", error);
      setFeedback([
        {
          message:
            language === "uz"
              ? "Tahlil qilishda xatolik yuz berdi!"
              : "An error occurred while analyzing the text!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Savol va bullet pointlar
  const question =
    language === "uz"
      ? "Mavzu: Mening sevimli faslim haqida insho yozing."
      : "Topic: Write an essay about my favorite season.";
  const bulletPoints = [
    language === "uz"
      ? "Qaysi fasl sizga yoqadi va nima uchun?"
      : "Which season do you like and why?",
    language === "uz"
      ? "Bu faslda qanday ob-havo bo‘ladi?"
      : "What is the weather like in this season?",
    language === "uz"
      ? "Bu faslda qanday faoliyatlar bilan shug‘ullanasiz?"
      : "What activities do you do in this season?",
  ];

  // Agar xatolik bo‘lsa yoki foydalanuvchi kirmagan bo‘lsa
  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <section className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">
        {language === "uz" ? "Yozish" : "Writing"}
      </h2>

      {/* Savol va bullet pointlar */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{question}</h3>
        <ul className="list-disc pl-5 space-y-1">
          {bulletPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Matn yozish joyi */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          {language === "uz" ? "Inshongizni yozing:" : "Write your essay:"}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border p-3 rounded-md h-40 resize-y"
          placeholder={
            language === "uz"
              ? "Bu yerda inshongizni yozing..."
              : "Write your essay here..."
          }
        />
      </div>

      {/* Tekshirish tugmasi */}
      <button
        onClick={checkWriting}
        disabled={isLoading}
        className={`w-full py-2 rounded-md text-white ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isLoading
          ? language === "uz"
            ? "Tekshirilmoqda..."
            : "Checking..."
          : language === "uz"
          ? "Tekshirish"
          : "Check"}
      </button>

      {/* Tahlil natijasi */}
      {feedback.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">
            {language === "uz" ? "Tahlil natijalari:" : "Analysis Results:"}
          </h3>
          <ul className="space-y-3">
            {feedback.map((item, index) => (
              <li key={index} className="border p-3 rounded-md bg-gray-50">
                <p className="text-red-500 font-medium">{item.message}</p>
                {item.shortMessage && (
                  <p className="text-gray-600">{item.shortMessage}</p>
                )}
                {item.context && (
                  <p className="text-gray-600">
                    <span className="font-medium">
                      {language === "uz" ? "Kontekst:" : "Context:"}
                    </span>{" "}
                    {item.context}
                  </p>
                )}
                {item.replacements && item.replacements.length > 0 && (
                  <p className="text-gray-600">
                    <span className="font-medium">
                      {language === "uz" ? "Takliflar:" : "Suggestions:"}
                    </span>{" "}
                    {item.replacements.join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ball ko‘rsatish */}
      <p className="mt-4 text-lg">
        {language === "uz" ? `Ballar: ${score}` : `Score: ${score}`}
      </p>
    </section>
  );
}

export default WritingSection;
