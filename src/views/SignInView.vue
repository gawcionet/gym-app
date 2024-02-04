<template>
  <div class="signin-container">
    <button class="signin-button" @click="signInWithGoogle">Sign In with Google</button>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useRouter } from "vue-router";
import { db } from "@/firebase/firebaseInit.js";

export default defineComponent({
  name: "SignInPage",
  setup() {
    const router = useRouter();

    const signInWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();

      signInWithPopup(auth, provider)
        .then((result) => {
          console.log("Successfully signed in with Google!");

          // Get UID
          const uid = result.user.uid;

          // Create a new document in users collection
          const userDocRef = doc(db, "users", uid);
          router.push("/");
        })
        .catch((error) => {
          console.log(error.code);
        });
    };

    return {
      signInWithGoogle,
    };
  },
});
</script>

<style scoped>
.signin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 87vh;
}

.signin-button {
  padding: 15px 20px;
  background-color: #333;
  color: #ccc;
  border: none;
  border-radius: 10px;
  font-size: 25px;
  cursor: pointer;
}

.signin-button:hover {
  background-color: #555;
}
</style>
