import { db, auth } from "@/firebase/firebaseInit.js";
import { doc, getDoc } from "firebase/firestore";

export async function fetchProgramDetails(id) {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const programDoc = doc(db, "users", currentUser.uid, "programs", id);
    const programSnapshot = await getDoc(programDoc);

    if (programSnapshot.exists()) {
      const programData = programSnapshot.data();
      const days = extractDays(programData);
      return {
        name: programData.name,
        desc: programData.desc,
        days: days
      };
    }
  }
  return null;
}

function extractDays(programData) {
  const days = [];
  for (const [dayKey, dayValue] of Object.entries(programData)) {
    if (dayKey.startsWith("d")) {
      const dayIndex = parseInt(dayKey.substring(1), 10);
      const day = {
        exercises: [],
        dayName: dayValue.dayName || ""
      };

      if (dayValue && typeof dayValue === "object") {
        const exercises = Object.entries(dayValue)
          .filter(([exerciseKey]) => exerciseKey.startsWith("ex"))
          .sort(([a], [b]) => {
            const indexA = parseInt(a.substring(2), 10);
            const indexB = parseInt(b.substring(2), 10);
            return indexA - indexB;
          });

        exercises.forEach(([exerciseKey, exerciseValue]) => {
          const exercise = {
            exName: exerciseValue.exName,
            exSets: exerciseValue.exSets
          };
          day.exercises.push(exercise);
        });
      }

      days[dayIndex - 1] = day;
    }
  }
  return days || [];
}

