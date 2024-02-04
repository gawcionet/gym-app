import { db, auth } from "@/firebase/firebaseInit.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const addExercise = async (programId, dayId) => {
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
      const exercisesCount = programData[dayKey]
        ? Object.keys(programData[dayKey]).length
        : 0;
      const newExerciseKey = `ex${exercisesCount + 1}`;

      const updatedProgramData = {
        ...programData,
        [dayKey]: {
          ...programData[dayKey],
          [newExerciseKey]: {
            exName: "Excersise name",
            exSets: "3"
          }
        }
      };

      await updateDoc(programDocRef, updatedProgramData);
    }
  }
};
