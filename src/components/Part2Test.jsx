import { useState } from "react";

const correctAnswers = ["apple", "banana", "orange"];

function Part2Test({ testNumber, updateScore }) {
  const [inputs, setInputs] = useState(Array(correctAnswers.length).fill(""));
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState([]);

  const handleChange = (i, val) => {
    const copy = [...inputs];
    copy[i] = val;
    setInputs(copy);
  };

  const checkAnswers = () => {
    const res = inputs.map(
      (inp, idx) => inp.trim().toLowerCase() === correctAnswers[idx]
    );
    const totalCorrect = res.filter(Boolean).length;
    updateScore(totalCorrect);
    setResult(res);
    setChecked(true);
  };

  return (
    <div className="mt-6">
      <p className="mb-4 font-medium">Matn: I like to eat ___, ___, and ___.</p>
      <div className="space-y-2">
        {correctAnswers.map((_, idx) => (
          <input
            key={idx}
            type="text"
            className={`border p-2 w-full rounded ${
              checked ? (result[idx] ? "bg-green-100" : "bg-red-100") : ""
            }`}
            value={inputs[idx]}
            onChange={(e) => handleChange(idx, e.target.value)}
            disabled={checked}
          />
        ))}
      </div>
      {!checked && (
        <button
          onClick={checkAnswers}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tekshirish
        </button>
      )}
      {checked && (
        <p className="mt-4 text-green-700 font-semibold">
          {`To‘g‘ri javoblar: ${result.filter(Boolean).length} / ${
            correctAnswers.length
          }`}
        </p>
      )}
    </div>
  );
}

export default Part2Test;
