import { db, auth } from "@/firebase/firebaseInit.js";
import { doc, collection, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

export async function fetchActiveTraining(tActiveId) {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const trainingActiveDoc = doc(
      db,
      "users",
      currentUser.uid,
      "trainingActive",
      tActiveId
    );
    const trainingActiveSnapshot = await getDoc(trainingActiveDoc);

    if (trainingActiveSnapshot.exists()) {
      const trainingActiveData = trainingActiveSnapshot.data();
      const exercises = extractExercises(trainingActiveData.exercises);
      return {
        exercises: exercises,
        dayName: trainingActiveData.dayName || ""
      };
    }
  }
  return null;
}

function extractExercises(exercisesArray) {
  const exercises = exercisesArray.map((exerciseValue) => {
    const sets = exerciseValue.sets.map((set) => ({
      reps: set.reps || 0,
      setNumber: set.setNumber,
      weight: set.weight || 0,
    }));

    return {
      exName: exerciseValue.exName || "",
      sets: sets || [],
    };
  });

  return exercises || [];
}

export async function fetchActiveTrainingData() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const userId = currentUser.uid;
    const userDocRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const trainingActiveCollectionRef = collection(userDocRef, "trainingActive");
      const querySnapshot = await getDocs(trainingActiveCollectionRef);
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        const activeTraining = await fetchActiveTraining(docId);
        return { id: docId, ...activeTraining };
      }
    }
  }
  return null;
}

export async function addExercise(tActiveId, exercise) {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const trainingActiveDocRef = doc(
      db,
      "users",
      currentUser.uid,
      "trainingActive",
      tActiveId
    );
    const trainingActiveSnapshot = await getDoc(trainingActiveDocRef);

    if (trainingActiveSnapshot.exists()) {
      const existingExercises = trainingActiveSnapshot.data().exercises || [];
      const updatedExercises = [...existingExercises, exercise];

      await setDoc(
        trainingActiveDocRef,
        { exercises: updatedExercises },
        { merge: true }
      );
    }
  }
}

export async function updateExerciseName(tActiveId, exerciseIndex, newName) {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const trainingActiveDocRef = doc(
      db,
      "users",
      currentUser.uid,
      "trainingActive",
      tActiveId
    );

    const trainingActiveSnapshot = await getDoc(trainingActiveDocRef);
    if (trainingActiveSnapshot.exists()) {
      const trainingActiveData = trainingActiveSnapshot.data();
      const existingExercises = trainingActiveData.exercises || [];

      if (exerciseIndex >= 0 && exerciseIndex < existingExercises.length) {
        existingExercises[exerciseIndex].exName = newName;
        await setDoc(trainingActiveDocRef, { exercises: existingExercises, dayName: trainingActiveData.dayName, started: trainingActiveData.started });
      }
    }
  }
}

export async function updateSetRepsAndWeight(tActiveId, exerciseIndex, setIndex, reps, weight) {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const trainingActiveDocRef = doc(
      db,
      "users",
      currentUser.uid,
      "trainingActive",
      tActiveId
    );

    const trainingActiveSnapshot = await getDoc(trainingActiveDocRef);
    if (trainingActiveSnapshot.exists()) {
      const trainingActiveData = trainingActiveSnapshot.data();
      const existingExercises = trainingActiveData.exercises || [];

      if (exerciseIndex >= 0 && exerciseIndex < existingExercises.length) {
        const exercise = existingExercises[exerciseIndex];
        const sets = exercise.sets || [];

        if (setIndex >= 0 && setIndex < sets.length) {
          sets[setIndex].reps = reps;
          sets[setIndex].weight = weight;
          await setDoc(trainingActiveDocRef, { exercises: existingExercises, dayName: trainingActiveData.dayName, started: trainingActiveData.started });
        }
      }
    }
  }
}

export async function deleteDocument(documentRef) {
  try {
    await deleteDoc(documentRef);
  } catch (error) {
    console.log("Error deleting document:", error);
    throw error;
  }
}
