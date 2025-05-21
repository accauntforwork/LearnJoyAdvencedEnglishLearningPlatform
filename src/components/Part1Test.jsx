import { useEffect, useState } from "react";

function Part1Test({ testNumber = 1, updateScore }) {
  const [testData, setTestData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    fetch(`/data/part1_test${testNumber}.json`)
      .then((res) => res.json())
      .then((data) => setTestData(data))
      .catch((err) => console.error("Testni yuklashda xatolik:", err));
  }, [testNumber]);

  const handleAnswerClick = (questionIndex, optionIndex) => {
    // Oldin tanlangan bo‘lsa, boshqa tanlashga ruxsat berilmaydi
    if (selectedAnswers[questionIndex] !== undefined) return;

    const isCorrect =
      testData.questions[questionIndex].correctIndex === optionIndex;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));

    if (isCorrect && updateScore) {
      updateScore(1);
    }
  };

  if (!testData) return <p>Test yuklanmoqda...</p>;

  return (
    <div className="p-4 bg-white rounded shadow space-y-6">
      <audio controls className="w-full mb-4">
        <source src={testData.audio} type="audio/mp3" />
        Sizning brauzeringiz audio faylni qo‘llab-quvvatlamaydi.
      </audio>

      {testData.questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-gray-50 p-4 rounded shadow-sm">
          <p className="font-semibold mb-3">
            {qIndex + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, optIndex) => {
              const selected = selectedAnswers[qIndex];
              const isCorrect = q.correctIndex === optIndex;
              const isSelected = selected === optIndex;

              let style =
                "block w-full text-left px-4 py-2 rounded border transition duration-200 shadow";

              if (selected !== undefined) {
                if (isSelected && isCorrect) {
                  style += " bg-green-100 border-green-500 ring ring-green-300";
                } else if (isSelected && !isCorrect) {
                  style += " bg-red-100 border-red-500 ring ring-red-300";
                } else if (isCorrect) {
                  style += " bg-green-50 border-green-400";
                } else {
                  style += " opacity-70";
                }
              } else {
                style += " hover:bg-blue-50";
              }

              return (
                <button
                  key={optIndex}
                  onClick={() => handleAnswerClick(qIndex, optIndex)}
                  disabled={selected !== undefined}
                  className={style}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-center text-sm text-gray-500 italic">
        Har bir to‘g‘ri javob uchun 1 ball beriladi.
      </p>
    </div>
  );
}

export default Part1Test;
