<template>
  <div class="container">
    <router-link class="back-icon" :to="`/`">
      <img src="@/assets/back.svg" alt="Back Icon">
    </router-link>
    <h1>{{ program ? program.name : "Training" }}</h1>
    <div v-if="program">
      <div v-for="(day, index) in program.days" :key="index">
        <h3>Day {{ index + 1 }}</h3>
        <div
          class="content-card"
          :id="`day${index + 1}`"
          @click="navigateToDay(index + 1)"
        >
          <div>
            <h3>{{ day.dayName || '' }}</h3>
            <ul>
              <li v-for="(exercise, exIndex) in day.exercises" :key="exIndex">
                {{ exercise.exName }} - {{ exercise.exSets }} sets
              </li>
            </ul>
          </div>
          <div class="right-icon">
            <img src="@/assets/chev_r.svg" alt="Right Icon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchProgramDetails } from "@/scripts/fetchProgramDetails.js";
import { db, auth } from "@/firebase/firebaseInit.js";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

export default {
  name: "TrainingDaysView",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      program: null,
      tActiveId: null
    };
  },
  methods: {
    async checkActiveWorkout() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const trainingActiveRef = collection(
          db,
          "users",
          currentUser.uid,
          "trainingActive"
        );
        const querySnapshot = await getDocs(trainingActiveRef);
        if (!querySnapshot.empty) {
          const override = confirm(
            "There is an active workout. Do you want to override it?"
          );
          if (override) {
            querySnapshot.forEach(async (doc) => {
              await deleteDoc(doc.ref);
            });
            return true;
          } else {
            return false;
          }
        }
      }
      return true;
    },
    async cloneExerciseData(day) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const exerciseData = day.exercises.map(exercise => {
          const sets = [];
          for (let i = 1; i <= exercise.exSets; i++) {
            sets.push({
              setNumber: i,
              weight: 0,
              reps: 0
            });
          }
          return {
            exName: exercise.exName,
            sets: sets
          };
        });

        const trainingActiveRef = collection(
          db,
          "users",
          currentUser.uid,
          "trainingActive"
        );

        const querySnapshot = await getDocs(trainingActiveRef);
        querySnapshot.forEach(async doc => {
          await deleteDoc(doc.ref);
        });

        const newDocRef = doc(trainingActiveRef);
        await setDoc(newDocRef, {
          exercises: exerciseData,
          dayName: day.dayName || ""
        });

        this.tActiveId = newDocRef.id;
      }
    },
    navigateToDay(dayIndex) {
      this.checkActiveWorkout().then(shouldNavigate => {
        if (shouldNavigate) {
          const day = this.program.days[dayIndex - 1];
          this.cloneExerciseData(day).then(() => {
            this.$router.push(`/training/${this.tActiveId}`);
          });
        }
      });
    },
    async fetchProgram() {
      this.program = await fetchProgramDetails(this.id);
    }
  },
  async mounted() {
    await this.fetchProgram();
  }
};
</script>
  
  <style scoped>
  .edit-input,
  textarea {
    background-color: transparent;
    border: none;
    color: #ccc;
    resize: none;
    outline: none;
    font-size: inherit;
    width: 100%;
  }
  
  .edit-input {
    padding: 0;
    margin: 0;
    border-bottom: 1px solid #ccc;
  }
  
  li {
    margin-bottom: 10px;
  }
  </style>
  