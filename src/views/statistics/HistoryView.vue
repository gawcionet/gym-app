<template>
    <div class="container">
      <router-link class="back-icon" to="/statistics">
        <img src="@/assets/back.svg" alt="Back Icon" />
      </router-link>
      <h1>History</h1>
      <router-link
        v-for="session in sessions"
        :key="session.id"
        :to="`/statistics/history/${session.id}`"
        class="content-card"
      >
        <div>
          <h3>{{ session.dayName }}</h3>
          <p>{{ formatDate(session.date) }}</p>
        </div>
        <div class="right-icon">
          <img src="@/assets/chev_r.svg" alt="Right Icon" />
        </div>
      </router-link>
    </div>
  </template>
  
  <script>
  import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
  import { db, auth } from "@/firebase/firebaseInit.js";
  
  export default {
    name: "HistoryView",
    data() {
      return {
        sessions: [],
      };
    },
    mounted() {
      this.fetchTrainingHistory();
    },
    methods: {
      fetchTrainingHistory() {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const trainingHistoryRef = collection(
            db,
            "users",
            currentUser.uid,
            "trainingHistory"
          );
          const q = query(trainingHistoryRef, orderBy("date", "desc"));
  
          onSnapshot(q, (snapshot) => {
            this.sessions = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
          });
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
