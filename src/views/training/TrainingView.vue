<template>
  <div class="container">
    <h1>Training</h1>
    <h3>Programs</h3>
    <div v-if="programs.length === 0" class="static-content-card">
      <div class="program-details">
        <h2>No programs to display</h2>
        <p>Go to Programs to create one</p>
      </div>
    </div>
    <router-link 
    v-for="program in programs"
    :key="program.id"
    :to="`/${program.id}`"
    class="content-card"
    >
      <div class="program-details">
        <h2>{{ program.name }}</h2>
        <p>{{ program.desc }}</p>
      </div>
      <div class="right-icon">
        <img src="@/assets/chev_r.svg" alt="Right Icon" />
      </div>
    </router-link>
    <div v-if="activeTraining">
      <h3>Active</h3>
      <router-link :to="`/training/${activeTraining.id}`" class="content-card">
        <div class="program-details">
          <h2>{{ activeTraining.dayName }}</h2>
          <p>Resume</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { fetchPrograms } from "@/scripts/fetchPrograms.js";
import { fetchActiveTrainingData } from "@/scripts/fetchActiveTraining.js";

export default {
  data() {
    return {
      programs: [],
      newProgramId: "",
      activeTraining: null
    };
  },
  async mounted() {
    await this.fetchPrograms();
    await this.fetchActiveTrainingData();
  },
  methods: {
    async fetchPrograms() {
      this.programs = await fetchPrograms();
    },
    async fetchActiveTrainingData() {
        const activeTraining = await fetchActiveTrainingData();
        this.activeTraining = activeTraining;
      }
  }
};
</script>

