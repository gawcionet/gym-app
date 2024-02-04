<template>
  <div class="container">
    <h1>Programs</h1>
    <router-link v-for="program in programs" :key="program.id" :to="`programs/${program.id}`" class="content-card">
      <div class="program-details">
        <h2>{{ program.name }}</h2>
        <p>{{ program.desc }}</p>
      </div>
      <div class="more-icon">
        <img src="@/assets/more.svg" alt="More Icon" />
      </div>
    </router-link>
    <router-link @click="createProgramAndNavigate" :to="`programs/${newProgramId}`" class="button-card">
      <div class="icon">
        <img src="@/assets/add.svg" alt="Add Icon" />
      </div>
    </router-link>
  </div>
</template>

<script>
import { fetchPrograms } from "@/scripts/fetchPrograms.js";
import { createProgram } from "@/scripts/createProgram.js";

export default {
  data() {
    return {
      programs: [],
      newProgramId: "",
    };
  },
  async mounted() {
    await this.fetchPrograms();
    await this.fetchPrograms();
  },
  methods: {
    async fetchPrograms() {
      this.programs = await fetchPrograms();
    },
    async createProgramAndNavigate() {
      const newProgramId = await createProgram();
      if (newProgramId) {
        this.$router.push(`/programs/${newProgramId}`);
      }
    }
  },
};
</script>
