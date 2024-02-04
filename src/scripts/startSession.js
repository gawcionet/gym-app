import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebaseInit.js";

export async function toggleStart(tActiveId) {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const userId = currentUser.uid;
    const activeTrainingDocRef = doc(
      db,
      "users",
      userId,
      "trainingActive",
      tActiveId
    );
    setDoc(activeTrainingDocRef, { started: true }, { merge: true });
  }
}

export async function checkStartedState(tActiveId) {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const userId = currentUser.uid;
    const activeTrainingDocRef = doc(
      db,
      "users",
      userId,
      "trainingActive",
      tActiveId
    );
    const activeTrainingSnapshot = await getDoc(activeTrainingDocRef);
    const activeTrainingData = activeTrainingSnapshot.data();
    if (activeTrainingData && activeTrainingData.started) {
      return false;
    }
  }
  return true;
}
