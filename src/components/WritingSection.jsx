import React, { useState, useEffect } from "react";

const WritingSection = () => {
  const [part, setPart] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/data/writing_part${part}.json`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setSelectedTask(null);
        setUserAnswer("");
        setResult(null);
      })
      .catch((err) => console.error("Xatolik:", err))
      .finally(() => setLoading(false));
  }, [part]);

  const handleTaskClick = (index) => {
    if (index === 0) {
      setSelectedTask(tasks[0]);
      setUserAnswer("");
      setResult(null);
    } else {
      setSelectedTask({
        title: `Test ${index + 1}`,
        description: "🛠 Tez orada...",
      });
      setUserAnswer("");
      setResult(null);
    }
  };

  const checkGrammar = async () => {
    if (!userAnswer.trim()) {
      alert("Iltimos, javob yozing.");
      return;
    }

    setChecking(true);

    try {
      const res = await fetch("https://api.languagetoolplus.com/v2/check", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          text: userAnswer,
          language: "en-US",
        }),
      });

      const data = await res.json();

      if (data.matches.length === 0) {
        setResult({ score: 10, errors: [] });
      } else {
        setResult({ score: 0, errors: data.matches });
      }
    } catch (err) {
      console.error("Xatolik:", err);
      alert("Tekshirishda xatolik yuz berdi.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center mb-4">Writing Section</h2>

      <div className="flex justify-center gap-2 mb-4">
        {[1, 2].map((p) => (
          <button
            key={p}
            className={`px-4 py-2 rounded ${
              part === p ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setPart(p)}
          >
            PART{p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleTaskClick(i)}
            className="border rounded p-2 hover:bg-gray-100"
          >
            Test {i + 1}
          </button>
        ))}
      </div>

      {loading && <p className="text-center">Yuklanmoqda...</p>}

      {selectedTask && (
        <div className="mt-4 border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">{selectedTask.title}</h3>
          <p className="mb-4">{selectedTask.description}</p>

          {selectedTask.description !== "🛠 Tez orada..." && (
            <>
              <textarea
                className="w-full h-40 border rounded p-2 mb-2"
                placeholder="Javobingizni shu yerga yozing..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              ></textarea>

              <button
                onClick={checkGrammar}
                disabled={checking}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {checking ? "Tekshirilmoqda..." : "AI orqali tekshirish"}
              </button>

              {result && (
                <div className="mt-4">
                  {result.score === 10 ? (
                    <p className="text-green-600 font-bold text-lg">
                      ✅ Grammatik xato topilmadi — Ball: 10
                    </p>
                  ) : (
                    <>
                      <p className="text-red-600 font-bold text-lg">
                        ❌ Xatoliklar topildi — Ball: 0
                      </p>
                      <ul className="list-disc pl-5 mt-2">
                        {result.errors.map((e, idx) => (
                          <li key={idx}>
                            <strong>{e.message}</strong> ({" "}
                            <em>{e.context.text}</em> )
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WritingSection;
