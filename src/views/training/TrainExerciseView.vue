<template>
    <div class="container">
      <router-link class="back-icon" :to="`/training/${tActiveId}`">
        <img src="@/assets/back.svg" alt="Back Icon" />
      </router-link>
      <div class="delete-icon" @click="showDeleteConfirmation">
        <img src="@/assets/delete.svg" alt="Delete Icon">
      </div>
      <h1>Edit exercise</h1>
      <div @click="toggleEditMode" :class="{ 'editing-mode': editingName }">
        <div class="content-card">
          <div class="program-details">
            <h2>
              <template v-if="!editingName">{{ exercise ? exercise.exName : '' }}</template>
              <input v-else v-model="newName" class="edit-input" />
            </h2>
          </div>
          <div class="edit-icon">
            <img
              v-if="!editingName"
              :src="require('@/assets/edit.svg')"
              alt="Edit Icon"
            />
            <img
              v-else
              :src="require('@/assets/check.svg')"
              alt="Check Icon"
              @click.stop="applyChanges"
            />
          </div>
        </div>
      </div>
      <div class="button-card" @click="startRestTimer">
        <div class="icon">
          <img :src="restTimerActive ? require('@/assets/pause.svg') : require('@/assets/timer.svg')" alt="Timer Icon" />
        </div>
        <div v-if="restTimerActive" class="rest-timer">
          {{ formatTime(restTime) }}
        </div>
      </div>
      <div v-for="(set, setIndex) in sets" :key="setIndex">
        <h3>Set {{ set.setNumber }}</h3>
        <div class="content-card-rw">
            <p>Reps: <input v-model="set.reps" @input="updateSet(setIndex, set.reps, set.weight)" class="edit-input-rw" /></p>
            <p>Weight: <input v-model="set.weight" @input="updateSet(setIndex, set.reps, set.weight)" class="edit-input-rw" /> kg</p>
        </div>
      </div>
      <div class="button-wrapper">
        <div class="wrapped-button" @click="addSet">
          <div class="icon">
            <img src="@/assets/add.svg" alt="Add Icon" />
          </div>
        </div>
        <div class="wrapped-button" style="margin-left: 10px;" @click="deleteSet">
          <div class="icon">
            <img src="@/assets/delete.svg" alt="Delete Icon" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { fetchActiveTrainingData, updateExerciseName, updateSetRepsAndWeight } from "@/scripts/fetchActiveTraining.js";
  import { doc, setDoc, collection } from "firebase/firestore";
  import { db, auth } from "@/firebase/firebaseInit.js";


  export default {
    name: "TrainExerciseView",
    props: {
      tActiveId: {
        type: String,
        required: true,
      },
      index: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        exercise: null,
        sets: [],
        editingName: false,
        newName: "",
        restTimerActive: false,
        restTime: 0,
        timerIntervalId: null
      };
    },
    async mounted() {
      await this.fetchExercise();
    },
    methods: {
      async fetchExercise() {
        const activeTraining = await fetchActiveTrainingData();
        if (activeTraining && this.index >= 0 && this.index < activeTraining.exercises.length) {
          this.exercise = activeTraining.exercises[this.index];
          this.sets = this.exercise.sets || [];
        }
      },
      toggleEditMode() {
        if (!this.editingName) {
          this.editingName = true;
          this.newName = this.exercise.exName;
        }
      },
      async applyChanges() {
        if (this.exercise) {
          await updateExerciseName(this.tActiveId, this.index, this.newName);
        }
        this.editingName = false;
        await this.fetchExercise();
      },
      showDeleteConfirmation() {
        const confirmDelete = confirm("Are you sure you want to delete this exercise?");
        if (confirmDelete) {
          this.deleteExercise();
        }
      },
      async deleteExercise() {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const activeTraining = await fetchActiveTrainingData();
            if (activeTraining && this.index >= 0 && this.index < activeTraining.exercises.length) {
            activeTraining.exercises.splice(this.index, 1);
            await setDoc(
                doc(
                collection(db, "users", currentUser.uid, "trainingActive"),
                this.tActiveId
                ),
                { exercises: activeTraining.exercises },
                { merge: true }
            );
            this.$router.push(`/training/${this.tActiveId}`); // Navigate to training view
            }
        }
      },
      updateSet(setIndex, reps, weight) {
        const currentUser = auth.currentUser;
        if (currentUser) {
        updateSetRepsAndWeight(this.tActiveId, this.index, setIndex, reps, weight);
        }
      },
      addSet() {
        const newSet = {
          setNumber: this.sets.length + 1,
          reps: 0,
          weight: 0
        };
        this.sets.push(newSet);
        this.updateExerciseSets();
      },

      deleteSet() {
        if (this.sets.length > 0) {
          this.sets.pop();
          this.updateExerciseSets();
        }
      },

      async updateExerciseSets() {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const activeTraining = await fetchActiveTrainingData();
          if (activeTraining && this.index >= 0 && this.index < activeTraining.exercises.length) {
            const exercise = activeTraining.exercises[this.index];
            exercise.sets = this.sets;
            await setDoc(
              doc(collection(db, "users", currentUser.uid, "trainingActive"), this.tActiveId),
              { exercises: activeTraining.exercises },
              { merge: true }
            );
          }
        }
      },
      startRestTimer() {
        if (this.restTimerActive) {
          this.stopRestTimer();
        } else {
          this.restTimerActive = true;
          this.restTime = 0;
          this.timerIntervalId = this.startTimer();
        }
      },

      startTimer() {
        return setInterval(() => {
          this.restTime += 1000;
        }, 1000);
      },

      stopRestTimer() {
        this.restTimerActive = false;
        clearInterval(this.timerIntervalId);
      },
      formatTime(time) {
        const minutes = Math.floor(time / 60000)
          .toString()
          .padStart(2, "0");
        const seconds = Math.floor((time % 60000) / 1000)
          .toString()
          .padStart(2, "0");
        return `${minutes}:${seconds}`;
      }
    },
  };
  </script>
  
  <style scoped>
  .content-card-rw {
      display: flex;
      align-items: center;
      background-color: #333;
      color: #ccc;
      text-decoration: none;
      min-height: 80px;
      padding-left: 30px;
      margin-bottom: 10px;
      border-radius: 20px;
      justify-content: space-around;
  }
  .edit-input {
    background-color: transparent;
    border: none;
    color: #ccc;
    resize: none;
    outline: none;
    font-size: inherit;
    width: 100%;
    padding: 0;
    margin: 0;
    border-bottom: 1px solid #ccc;
  }
  .edit-input-rw {
    background-color: transparent;
    border: none;
    color: #ccc;
    resize: none;
    outline: none;
    font-size: inherit;
    width: 30%;
    padding: 0;
    margin: 0;
    border-bottom: 1px solid #ccc;
    text-align: center;
  }
  .rest-timer {
    text-align: center;
    color: #ccc;
    font-size:30px;
  }

  p {
    font-size: 18px;
  }
  </style>
  