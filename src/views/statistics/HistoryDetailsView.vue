<template>
    <div class="container">
      <router-link class="back-icon" to="/statistics/history">
        <img src="@/assets/back.svg" alt="Back Icon" />
      </router-link>
      <h1>{{ session && session.dayName }}</h1>
      <div class="content-card-noimg">
        <h3 v-if="session">Date: {{ formatDate(session.date) }}</h3>
        <p v-if="session">Duration: {{ session.elapsedTime }}</p>
      </div>
      <div v-if="session && session.exercises && session.exercises.length > 0">
        <div v-for="exercise in session.exercises" :key="exercise.exName">
          <h3 style="text-align: center">{{ exercise.exName }}</h3>
          <div v-for="set in exercise.sets" :key="set.setNumber" class="content-card-noimg">
            <h4>Set {{ set.setNumber }}</h4>
            <p>Reps: {{ set.reps }}</p>
            <p>Weight: {{ set.weight }} kg</p>
          </div>
        </div>
      </div>
      <div v-else>
        <p v-if="!session">Loading...</p>
        <p v-else>No exercises found.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { doc, getDoc } from "firebase/firestore";
  import { db, auth } from "@/firebase/firebaseInit.js";
  
  export default {
    name: "HistoryDetailsView",
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        session: null,
      };
    },
    async mounted() {
      await this.fetchSessionData();
    },
    methods: {
      async fetchSessionData() {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const sessionDocRef = doc(
            db,
            "users",
            currentUser.uid,
            "trainingHistory",
            this.id
          );
          const sessionSnapshot = await getDoc(sessionDocRef);
          if (sessionSnapshot.exists()) {
            this.session = sessionSnapshot.data();
          }
        }
      },
      formatDate(timestamp) {
        const date = timestamp.toDate();
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
  };
  </script>
  