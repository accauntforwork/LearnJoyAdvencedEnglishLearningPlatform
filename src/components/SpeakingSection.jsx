// src/components/SpeakingSection.jsx
import { useState, useEffect } from "react";
import speakingData from "../data/speaking.json";

function SpeakingSection() {
  const [currentPart, setCurrentPart] = useState(1);
  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [recording, setRecording] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [started, setStarted] = useState(false);

  const questions =
    speakingData[`part${currentPart}`]?.[`test${currentTest}`] || [];

  useEffect(() => {
    let interval = null;
    if (recording && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (recording && timer === 0) {
      clearInterval(interval);
      setRecording(false);
    }
    return () => clearInterval(interval);
  }, [recording, timer]);

  const startSpeaking = () => {
    setStarted(true);
    setRecording(true);
    setTimer(30);
    setCurrentQuestionIndex(0);
    setCompleted(false);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimer(30);
      setRecording(true);
    } else {
      setRecording(false);
      setCompleted(true);
    }
  };

  const renderWave = () => (
    <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-ping mx-auto mb-4"></div>
  );

  return (
    <section className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Speaking Section</h2>

      {/* Part tanlash */}
      <div className="flex space-x-4 mb-4">
        {[1, 2, 3, 4].map((part) => (
          <button
            key={part}
            onClick={() => {
              setCurrentPart(part);
              setCurrentTest(null);
              setStarted(false);
              setCompleted(false);
            }}
            className={`px-4 py-2 rounded ${
              currentPart === part ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Part {part}
          </button>
        ))}
      </div>

      {/* Test tanlash */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {[...Array(10)].map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentTest(i + 1);
              setStarted(false);
              setCompleted(false);
              setCurrentQuestionIndex(0);
            }}
            className={`py-2 rounded ${
              currentTest === i + 1
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Test {i + 1}
          </button>
        ))}
      </div>

      {/* Test mavjud bo‘lsa */}
      {currentTest && questions.length > 0 ? (
        <>
          {!started ? (
            <div className="text-center">
              <p className="mb-4 text-lg">Testni boshlashga tayyormisiz?</p>
              <button
                onClick={startSpeaking}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Start Speaking
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Savol {currentQuestionIndex + 1}:
              </h3>
              <p className="mb-4 text-xl">{questions[currentQuestionIndex]}</p>

              {recording && renderWave()}
              {recording && (
                <p className="text-red-600 text-lg font-bold mb-4">
                  ⏱ {timer} sekund
                </p>
              )}

              {!recording && !completed && (
                <button
                  onClick={nextQuestion}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Keyingi savol
                </button>
              )}

              {completed && (
                <p className="text-green-600 font-semibold mt-6">
                  ✅ Yozib olindi va tekshirish uchun mutaxassislarga yuborildi.
                </p>
              )}
            </div>
          )}
        </>
      ) : currentTest ? (
        <p className="text-gray-500 italic">
          Ushbu test hali mavjud emas. Tez orada qo‘shiladi...
        </p>
      ) : (
        <p className="text-gray-500 italic">Iltimos, testni tanlang.</p>
      )}
    </section>
  );
}

export default SpeakingSection;
