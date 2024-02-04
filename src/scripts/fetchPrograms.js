import { db, auth } from "@/firebase/firebaseInit.js";
import { collection, query, getDocs } from "firebase/firestore";

export async function fetchPrograms() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const programsCollection = collection(
      db,
      "users",
      currentUser.uid,
      "programs"
    );
    const programsQuery = query(programsCollection);
    const programsSnapshot = await getDocs(programsQuery);

    return programsSnapshot.docs.map((programDoc) => {
      const programData = programDoc.data();
      return {
        id: programDoc.id,
        name: programData.name,
        desc: programData.desc,
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }
  return [];
}
