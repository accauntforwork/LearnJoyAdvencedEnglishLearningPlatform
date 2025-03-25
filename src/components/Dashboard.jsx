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
        console.log("Progress from Firestore:", userProgress);

        // Kalitlarni kichik harfga o‘zgartirish va reading qismini umumlashtirish
        const normalizedProgress = {};
        let readingScore = 0;

        if (userProgress && typeof userProgress === "object") {
          Object.keys(userProgress).forEach((key) => {
            const lowerKey = key.toLowerCase();

            if (lowerKey.startsWith("reading")) {
              readingScore += userProgress[key]; // Barcha reading ballarini qo‘shish
            } else {
              normalizedProgress[lowerKey] = userProgress[key] || 0;
            }
          });

          // Umumiy reading ballini qo‘shish
          if (readingScore > 0) {
            normalizedProgress["reading"] = readingScore;
          }
        }

        console.log("Normalized Progress:", normalizedProgress);
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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <p className="text-center">
          {language === "uz" ? "Yuklanmoqda..." : "Loading..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

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

  console.log("Total Score (calculated):", totalScore);

  return (
    <section className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        {language === "uz" ? "Boshqaruv paneli" : "Dashboard"}
      </h2>
      <h3 className="text-lg font-medium mb-4">
        {language === "uz" ? "Sizning natijalaringiz:" : "Your Progress:"}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border p-2 text-left">
                {language === "uz" ? "Bo‘lim" : "Section"}
              </th>
              <th className="border p-2 text-left">
                {language === "uz" ? "Ball" : "Score"}
              </th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.key} className="hover:bg-gray-100">
                <td className="border p-2">{section.name}</td>
                <td className="border p-2">{progress[section.key] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <p className="text-lg font-medium">
          {language === "uz" ? "Umumiy ball:" : "Total Score:"} {totalScore}
        </p>
      </div>
    </section>
  );
}

export default Dashboard;

// // src/components/Dashboard.jsx
// import { useState, useEffect } from "react";
// import { getProgress } from "../firebase";

// function Dashboard({ language, user }) {
//   const [progress, setProgress] = useState({});
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadProgress = async () => {
//       if (!user) {
//         setError(
//           language === "uz"
//             ? "Iltimos, tizimga kiring!"
//             : "Please log in to continue!"
//         );
//         setLoading(false);
//         return;
//       }

//       try {
//         const userProgress = await getProgress(user.uid);
//         console.log("Progress from Firestore:", userProgress); // Debugging uchun
//         // Progress ob'ektini tekshirish va to'g'rilash
//         if (userProgress && typeof userProgress === "object") {
//           setProgress(userProgress);
//         } else {
//           setProgress({});
//         }
//       } catch (err) {
//         setError(
//           language === "uz"
//             ? "Progressni yuklashda xatolik yuz berdi!"
//             : "Error loading progress!"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProgress();
//   }, [user, language]);

//   const sections = [
//     { key: "grammar", name: language === "uz" ? "Grammatika" : "Grammar" },
//     { key: "vocabulary", name: language === "uz" ? "Lug‘at" : "Vocabulary" },
//     { key: "listening", name: language === "uz" ? "Eshitish" : "Listening" },
//     { key: "reading", name: language === "uz" ? "O‘qish" : "Reading" },
//     { key: "speaking", name: language === "uz" ? "Gapirish" : "Speaking" },
//     { key: "writing", name: language === "uz" ? "Yozish" : "Writing" },
//   ];

//   if (loading) {
//     return (
//       <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//         <p className="text-center">
//           {language === "uz" ? "Yuklanmoqda..." : "Loading..."}
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//         <p className="text-red-500 text-center">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <section className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold mb-4">
//         {language === "uz" ? "Boshqaruv paneli" : "Dashboard"}
//       </h2>
//       <h3 className="text-lg font-medium mb-4">
//         {language === "uz" ? "Sizning natijalaringiz:" : "Your Progress:"}
//       </h3>

//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-blue-500 text-white">
//               <th className="border p-2 text-left">
//                 {language === "uz" ? "Bo‘lim" : "Section"}
//               </th>
//               <th className="border p-2 text-left">
//                 {language === "uz" ? "Ball" : "Score"}
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {sections.map((section) => {
//               const score = progress[section.key] || 0;
//               console.log(`Section: ${section.key}, Score: ${score}`); // Har bir bo‘lim uchun ballni konsolga chiqarish
//               return (
//                 <tr key={section.key} className="hover:bg-gray-100">
//                   <td className="border p-2">{section.name}</td>
//                   <td className="border p-2">{score}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       <div className="mt-6">
//         <p className="text-lg font-medium">
//           {language === "uz" ? "Umumiy ball:" : "Total Score:"}{" "}
//           {Object.values(progress).reduce(
//             (sum, score) => sum + (score || 0),
//             0
//           )}
//         </p>
//       </div>
//     </section>
//   );
// }

// export default Dashboard;

// // src/components/Dashboard.jsx
// import { useState, useEffect } from "react";
// import { getProgress } from "../firebase";

// function Dashboard({ language, user }) {
//   const [progress, setProgress] = useState({});
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadProgress = async () => {
//       if (!user) {
//         setError(
//           language === "uz"
//             ? "Iltimos, tizimga kiring!"
//             : "Please log in to continue!"
//         );
//         setLoading(false);
//         return;
//       }

//       try {
//         const userProgress = await getProgress(user.uid);
//         console.log("Progress:", userProgress); // Debugging uchun
//         setProgress(userProgress);
//       } catch (err) {
//         setError(
//           language === "uz"
//             ? "Progressni yuklashda xatolik yuz berdi!"
//             : "Error loading progress!"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProgress();
//   }, [user, language]);

//   const sections = [
//     { key: "grammar", name: language === "uz" ? "Grammatika" : "Grammar" },
//     { key: "vocabulary", name: language === "uz" ? "Lug‘at" : "Vocabulary" },
//     { key: "listening", name: language === "uz" ? "Eshitish" : "Listening" },
//     { key: "reading", name: language === "uz" ? "O‘qish" : "Reading" },
//     { key: "speaking", name: language === "uz" ? "Gapirish" : "Speaking" },
//     { key: "writing", name: language === "uz" ? "Yozish" : "Writing" },
//   ];

//   if (loading) {
//     return (
//       <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//         <p className="text-center">
//           {language === "uz" ? "Yuklanmoqda..." : "Loading..."}
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//         <p className="text-red-500 text-center">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <section className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold mb-4">
//         {language === "uz" ? "Boshqaruv paneli" : "Dashboard"}
//       </h2>
//       <h3 className="text-lg font-medium mb-4">
//         {language === "uz" ? "Sizning natijalaringiz:" : "Your Progress:"}
//       </h3>

//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-blue-500 text-white">
//               <th className="border p-2 text-left">
//                 {language === "uz" ? "Bo‘lim" : "Section"}
//               </th>
//               <th className="border p-2 text-left">
//                 {language === "uz" ? "Ball" : "Score"}
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {sections.map((section) => (
//               <tr key={section.key} className="hover:bg-gray-100">
//                 <td className="border p-2">{section.name}</td>
//                 <td className="border p-2">{progress[section.key] || 0}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="mt-6">
//         <p className="text-lg font-medium">
//           {language === "uz" ? "Umumiy ball:" : "Total Score:"}{" "}
//           {Object.values(progress).reduce(
//             (sum, score) => sum + (score || 0),
//             0
//           )}
//         </p>
//       </div>
//     </section>
//   );
// }

// export default Dashboard;
