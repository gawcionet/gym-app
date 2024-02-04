import { db, auth } from "@/firebase/firebaseInit.js";
import { doc, updateDoc, deleteField } from "firebase/firestore";

export async function deleteProgramDay(programId, dayKey) {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const programDocRef = doc(
      db,
      "users",
      currentUser.uid,
      "programs",
      programId
    );

    try {
      const updatedProgramData = {
        [dayKey]: deleteField()
      };
      await updateDoc(programDocRef, updatedProgramData);
    } catch (error) {
      console.error("Error deleting program day:", error);
      throw error;
    }
  }
}
