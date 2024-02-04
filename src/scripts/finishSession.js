import { deleteDocument } from "./fetchActiveTraining.js";
import { doc, setDoc, getDocFromServer, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/firebase/firebaseInit.js";

export async function finishSession(tActiveId, router, elapsedTime) {
  const confirmFinish = confirm("Are you sure you want to finish your session?");
  if (!confirmFinish) {
    return; // Exit if user cancels
  }

  const currentUser = auth.currentUser;
  if (currentUser) {
    const activeTrainingDocRef = doc(
      db,
      "users",
      currentUser.uid,
      "trainingActive",
      tActiveId
    );
    const activeTrainingSnapshot = await getDocFromServer(activeTrainingDocRef);
    const activeTrainingData = activeTrainingSnapshot.data();

    // Copy the active training document to training history
    if (activeTrainingData) {
      const trainingHistoryDocRef = doc(
        db,
        "users",
        currentUser.uid,
        "trainingHistory",
        tActiveId
      );
      const formattedTime = formatTime(elapsedTime); // Format the elapsed time

      // Create a new object to hold the training history data
      const trainingHistoryData = {
        ...activeTrainingData,
        elapsedTime: formattedTime,
        date: serverTimestamp(),
      };

      // Convert reps and weight fields to numbers
      if (trainingHistoryData.exercises) {
        trainingHistoryData.exercises.forEach((exercise) => {
          if (exercise.sets) {
            exercise.sets.forEach((set) => {
              set.reps = parseInt(set.reps);
              set.weight = parseInt(set.weight);
            });
          }
        });
      }

      // Set the training history document with the updated data
      await setDoc(trainingHistoryDocRef, trainingHistoryData);
    }

    // Delete the active training document
    await deleteDocument(activeTrainingDocRef);

    // Redirect to the main page or any other desired route
    router.push("/");
  }
}

function formatTime(time) {
  const hours = Math.floor(time / 3600000)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time % 3600000) / 60000)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((time % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export async function cancelSession(tActiveId, router) {
  const confirmCancel = confirm("Do you want to cancel the session?");
  if (confirmCancel) {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid, "trainingActive", tActiveId);
      deleteDocument(docRef);
      router.push("/");
    }
  }
}
