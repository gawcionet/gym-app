import { db, auth } from "@/firebase/firebaseInit.js";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export async function addProgramDay(programId) {
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
      const programDocSnapshot = await getDoc(programDocRef);
      if (programDocSnapshot.exists()) {
        const programData = programDocSnapshot.data();

        // Find the next available day number
        let nextDayNumber = 1;
        while (programData.hasOwnProperty(`d${nextDayNumber}`)) {
          nextDayNumber++;
        }

        // Create the new day map
        const newDayMap = {
          [`d${nextDayNumber}`]: {}
        };

        // Update the program document with the new day map
        await updateDoc(programDocRef, newDayMap);
      }
    } catch (error) {
      console.error("Error adding program day:", error);
    }
  }
}
