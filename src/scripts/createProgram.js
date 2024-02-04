import { db, auth } from "@/firebase/firebaseInit.js";
import { addDoc, collection } from "firebase/firestore";

export const createProgram = async () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const programsCollectionRef = collection(
      db,
      "users",
      currentUser.uid,
      "programs"
    );
    const newProgramDocRef = await addDoc(programsCollectionRef, {
      name: "New Program",
      desc: "New program description",
    });
    return newProgramDocRef.id;
  }
  return null;
};
