import { db, auth } from "@/firebase/firebaseInit.js";
import { doc, deleteDoc } from "firebase/firestore";

export async function deleteProgram(programId) {
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
      await deleteDoc(programDocRef);
    } catch (error) {
      console.error("Error deleting program:", error);
    }
  }
}
