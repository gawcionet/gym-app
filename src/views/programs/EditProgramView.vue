<template>
  <div class="container">
    <router-link class="back-icon" :to="`/programs`">
      <img src="@/assets/back.svg" alt="Back Icon">
    </router-link>
    <div class="delete-icon" @click="showDeleteConfirmation">
      <img src="@/assets/delete.svg" alt="Delete Icon">
    </div>
    <h1>Edit Program</h1>
    <div v-if="program">
      <div
        @click="toggleEditMode"
        :class="{ 'editing-mode': editingName || editingDesc }"
      >
        <div class="content-card">
          <div class="program-details">
            <h2>
              <template v-if="!editingName">{{ program.name }}</template>
              <input v-else v-model="newName" class="edit-input" />
            </h2>
            <p>
              <template v-if="!editingDesc">{{ program.desc }}</template>
              <textarea v-else v-model="newDesc" class="edit-input"></textarea>
            </p>
          </div>
          <div class="edit-icon">
            <img
              v-if="!editingName && !editingDesc"
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
      <div v-for="(day, index) in program.days" :key="index">
        <h3>Day {{ index + 1 }}</h3>
        <router-link
          :to="`/programs/${id}/d${index + 1}`"
          class="content-card"
          :id="`day${index + 1}`"
        >
          <div>
            <h3>{{ day.dayName || '' }}</h3>
            <ul>
              <li v-for="(exercise, exIndex) in day.exercises" :key="exIndex">
                {{ exercise.exName }} - {{ exercise.exSets }} sets
              </li>
            </ul>
          </div>
          <div class="more-icon">
            <img src="@/assets/more.svg" alt="More Icon" />
          </div>
        </router-link>
      </div>
    </div>
    <div class="button-wrapper">
      <router-link class="wrapped-button" :to="`/editday/${id}`" @click="addDay">
        <div class="icon">
          <img src="@/assets/add.svg" alt="Add Icon" />
        </div>
      </router-link>
      <div v-if="hasDays" class="wrapped-button" style="margin-left: 10px;" @click="deleteProgramDayConfirmation(`d${program.days.length}`)">
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
import { doc, updateDoc } from "firebase/firestore";
import { deleteProgram } from "@/scripts/deleteProgram.js";
import { addProgramDay } from "@/scripts/addProgramDay.js";
import { deleteProgramDay } from "@/scripts/deleteProgramDay.js";


export default {
  name: "EditProgramView",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      program: null,
      editingName: false,
      editingDesc: false,
      newName: "",
      newDesc: ""
    };
  },
  async mounted() {
    await this.fetchProgram();
  },
  computed: {
    hasDays() {
      return this.program && this.program.days && this.program.days.length > 0;
    }
  },
  methods: {
    async fetchProgram() {
      this.program = await fetchProgramDetails(this.id);
      if (this.program) {
        this.newName = this.program.name;
        this.newDesc = this.program.desc;
      }
    },
    toggleEditMode() {
      if (!this.editingName && !this.editingDesc) {
        this.editingName = true;
        this.editingDesc = true;
        this.$forceUpdate(); // Update component
      }
    },
    async applyChanges() {
      if (this.editingName || this.editingDesc) {
        this.editingName = false;
        this.editingDesc = false;
        await this.updateProgram();
        this.fetchProgram(); // Refresh
      }
    },
    async updateProgram() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const programDocRef = doc(
          db,
          "users",
          currentUser.uid,
          "programs",
          this.id
        );
        await updateDoc(programDocRef, {
          name: this.newName,
          desc: this.newDesc
        });
      }
    },
    showDeleteConfirmation() {
      if (confirm("Are you sure you want to delete this program?")) {
        deleteProgram(this.id);
        this.$router.push("/programs"); // Navigate to programs
      }
    },
    async addDay() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const dayIndex = this.program.days.length + 1;
        await addProgramDay(this.id);
        this.$router.push(`/programs/${this.id}/d${dayIndex}`);
      }
    },
    deleteProgramDayConfirmation(dayKey) {
      if (confirm("Are you sure you want to delete a day?")) {
        deleteProgramDay(this.id, dayKey);
        this.fetchProgram(); // Refresh
      }
    }
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
