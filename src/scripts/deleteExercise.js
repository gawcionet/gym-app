import { db, auth } from "@/firebase/firebaseInit.js";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export const deleteExercise = async (programId, dayId) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const programDocRef = doc(
      db,
      "users",
      currentUser.uid,
      "programs",
      programId
    );
    const programSnapshot = await getDoc(programDocRef);

    if (programSnapshot.exists()) {
      const programData = programSnapshot.data();
      const dayKey = `d${parseInt(dayId.substring(1), 10)}`;

      if (programData[dayKey]) {
        const exerciseKeys = Object.keys(programData[dayKey])
          .filter(key => key !== 'dayName') // Exclude the dayName field
          .sort(); // Sort the exercise keys

        const latestExerciseKey = exerciseKeys.pop(); // Get the latest exercise key

        if (latestExerciseKey) {
          const updatedProgramData = {
            ...programData,
            [dayKey]: {
              ...programData[dayKey]
            }
          };
          delete updatedProgramData[dayKey][latestExerciseKey];

          await updateDoc(programDocRef, updatedProgramData);
        }
      }
    }
  }
};
