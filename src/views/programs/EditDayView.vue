<template>
    <div class="container">
      <router-link class="back-icon" :to="`/programs/${id}`">
        <img src="@/assets/back.svg" alt="Back Icon">
      </router-link>
      <h1>Edit Day {{ dayId.substring(1) }}</h1>
      <div v-if="day">
        <div>
          <div v-if="!day.editingName" @click="toggleDayEditMode(day)" class="content-card">
            <h3>{{ day.dayName || 'Set day name'}}</h3>
            <div class="edit-icon">
              <img src="@/assets/edit.svg" alt="Edit Icon" />
            </div>
          </div>
          <div v-else class="content-card">
            <input v-model="day.newName" class="edit-input"/>
            <div class="edit-icon" @click.stop="applyDayChanges(day)">
              <img src="@/assets/check.svg" alt="Check Icon" />
            </div>
          </div>
        </div>
        <h3>Exercises</h3>
        <div v-for="(exercise, index) in day.exercises" :key="index">
          <div v-if="!exercise.editingName && !exercise.editingSets" class="content-card" @click="toggleEditMode(exercise)">
            <div>
              <h3>{{ exercise.exName }}</h3>
              <p>Sets: {{ exercise.exSets }}</p>
            </div>
            <div class="edit-icon">
              <img src="@/assets/edit.svg" alt="Edit Icon" />
            </div>
          </div>
          <div v-else class="content-card">
            <div>
              <input v-model="exercise.newName" class="edit-input"/>
              <input v-model="exercise.newSets" class="edit-input"/>
            </div>
            <div class="edit-icon" @click.stop="applyChanges(exercise)">
              <img src="@/assets/check.svg" alt="Check Icon" />
            </div>
          </div>
        </div>
      </div>
      <div class="button-wrapper">
        <div class="wrapped-button" @click="addExercise">
          <div class="icon">
            <img src="@/assets/add.svg" alt="Add Icon" />
          </div>
        </div>
        <div v-if="hasExercises" class="wrapped-button" style="margin-left: 10px;" @click="deleteExercise">
          <div class="icon">
            <img src="@/assets/delete.svg" alt="Delete Icon" />
          </div>
        </div>
      </div>
    </div>
</template>
  
  
<script>
  import { fetchProgramDetails } from "@/scripts/fetchProgramDetails.js";
  import { db, auth } from "@/firebase/firebaseInit.js";
  import { doc, updateDoc, getDoc } from "firebase/firestore";
  import { addExercise } from "@/scripts/addExercise.js";
  import { deleteExercise } from "@/scripts/deleteExercise.js";

  export default {
    name: "EditDayView",
    props: {
      id: {
        type: String,
        required: true
      },
      dayId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        day: '',
        editingName: false,
        newName: ''
      };
    },
    async mounted() {
      await this.fetchDay();
    },
    computed: {
      hasExercises() {
        return this.day && this.day.exercises.length > 0;
      }
    },
    methods: {
      async fetchDay() {
        const program = await fetchProgramDetails(this.id);
        if (program) {
          const dayIndex = parseInt(this.dayId.substring(1), 10);
          this.day = {
            ...program.days[dayIndex - 1],
            editingName: false,
            newName: ''
          };
          this.day.exercises.forEach(exercise => {
            exercise.editingName = false;
            exercise.editingSets = false;
            exercise.newName = exercise.exName;
            exercise.newSets = exercise.exSets;
          });
        }
      },
      toggleEditMode(exercise) {
        if (!exercise.editingName && !exercise.editingSets) {
          exercise.editingName = true;
          exercise.editingSets = true;
        }
      },
      toggleDayEditMode(day) {
        day.editingName = !day.editingName;
        if (day.editingName) {
          day.newName = day.dayName;
        }
      },
      async applyChanges(exercise) {
        if (exercise.editingName || exercise.editingSets) {
          exercise.editingName = false;
          exercise.editingSets = false;
          exercise.exName = exercise.newName;
          exercise.exSets = exercise.newSets;
  
          // Update Firestore
          const currentUser = auth.currentUser;
          if (currentUser) {
            const programDocRef = doc(
              db,
              "users",
              currentUser.uid,
              "programs",
              this.id
            );
            const programSnapshot = await getDoc(programDocRef);
  
            if (programSnapshot.exists()) {
              const programData = programSnapshot.data();
              const dayKey = `d${parseInt(this.dayId.substring(1), 10)}`;
  
              // Find index
              const exerciseIndex = this.day.exercises.findIndex(
                ex => ex === exercise
              );
  
              if (exerciseIndex !== -1) {
                const exerciseKey = `ex${exerciseIndex + 1}`;
                const updatedProgramData = {
                  ...programData,
                  [dayKey]: {
                    ...programData[dayKey],
                    [exerciseKey]: {
                      exName: exercise.exName,
                      exSets: exercise.exSets
                    }
                  }
                };
  
                await updateDoc(programDocRef, updatedProgramData);
              }
            }
          }
        }
      },
      async applyDayChanges(day) {
        if (day.editingName) {
          day.editingName = false;
          day.dayName = day.newName;

          // Update day's name in Firestore
          const currentUser = auth.currentUser;
          if (currentUser) {
            const programDocRef = doc(
              db,
              "users",
              currentUser.uid,
              "programs",
              this.id
            );
            const programSnapshot = await getDoc(programDocRef);

            if (programSnapshot.exists()) {
              const programData = programSnapshot.data();
              const dayKey = `d${parseInt(this.dayId.substring(1), 10)}`;
              const updatedProgramData = {
                ...programData,
                [dayKey]: {
                  ...programData[dayKey],
                  dayName: day.dayName
                }
              };

              await updateDoc(programDocRef, updatedProgramData);
            }
          }
        }
      },
      async addExercise() {
        await addExercise(this.id, this.dayId);
        await this.fetchDay(); // Refresh
      },
      async deleteExercise() {
        await deleteExercise(this.id, this.dayId);
        await this.fetchDay(); // Refresh
      }
    }
  };
</script>
  
<style scoped>
  .edit-input {
    background-color: transparent;
    border: none;
    color: #ccc;
    resize: none;
    outline: none;
    font-size: inherit;
    width: 100%;
    padding: 10px 0 10px 0;
    margin: 10px 0 10px 0;
    border-bottom: 1px solid #ccc;
  }

  li {
    margin-bottom: 10px;
  }
</style>