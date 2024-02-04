<template>
  <div class="container">
    <router-link class="back-icon" :to="`/`">
      <img src="@/assets/back.svg" alt="Back Icon" />
    </router-link>
    <div class="delete-icon" @click="cancelSession">
      <img src="@/assets/delete.svg" alt="Delete Icon">
    </div>
    <div class="timer">
      <h2>{{ formatTime(timer) }}</h2>
    </div><br><br>
    <h1>{{ day.dayName || `Session` }}</h1>
    <div v-if="showStart">
      <div class="button-card" @click="toggleStart">
        <div class="icon">
          <img src="@/assets/training.svg" alt="Training Icon" />
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="day">
        <router-link
          v-for="(exercise, index) in day.exercises"
          :key="index"
          :to="`/training/${tActiveId}/${index}`"
          class="content-card"
        >
          <div>
            <h3>{{ exercise.exName }}</h3>
          </div>
          <div class="right-icon">
            <img src="@/assets/chev_r.svg" alt="Right Icon" />
          </div>
        </router-link>
      </div>
      <div class="button-card" @click="addExercise">
        <div class="icon">
          <img src="@/assets/add.svg" alt="Add Icon" />
        </div>
      </div>
      <div class="button-card" @click="finishSession">
        <div class="icon">
          <img src="@/assets/check.svg" alt="Add Icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchActiveTraining, addExercise } from "@/scripts/fetchActiveTraining.js";
import { finishSession, cancelSession } from "@/scripts/finishSession.js";
import { toggleStart, checkStartedState } from "@/scripts/startSession.js";
import { startTimer, resetTimer } from "@/scripts/timer.js";

export default {
  name: "TrainView",
  props: {
    tActiveId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      day: "",
      showStart: true,
      timer: 0,
    };
  },
  async mounted() {
    await this.fetchDay();
    await this.checkStartedState();
    if (!this.showStart) {
      this.startTimer();
    }
  },
  computed: {
    hasExercises() {
      return this.day && this.day.exercises && this.day.exercises.length > 0;
    },
  },
  methods: {
    async fetchDay() {
      const activeTraining = await fetchActiveTraining(this.tActiveId);
      if (activeTraining) {
        this.day = {
          ...activeTraining,
          dayName: activeTraining.dayName || "",
        };
      }
    },
    async addExercise() {
      const exercise = {
        exName: "New exercise",
        sets: [
          {
            setNumber: 1,
            reps: 0,
            weight: 0,
          },
        ],
      };
      await addExercise(this.tActiveId, exercise);
      await this.fetchDay();
    },
    async finishSession() {
      await finishSession(this.tActiveId, this.$router, this.timer);
    },
    async cancelSession() {
      await cancelSession(this.tActiveId, this.$router);
    },
    toggleStart() {
      this.showStart = false;
      toggleStart(this.tActiveId);
      this.stopTimer();
      this.startTimer();
    },
    async checkStartedState() {
      const started = await checkStartedState(this.tActiveId);
      this.showStart = started;
    },
    startTimer() {
      const storedTime = localStorage.getItem("timerElapsed");
      if (storedTime) {
        this.timer = parseInt(storedTime, 10);
      } else {
        this.timer = 0;
      }
      startTimer((elapsedTime) => {
        this.timer = elapsedTime;
        localStorage.setItem("timerElapsed", elapsedTime.toString());
      });
    },
    stopTimer() {
      resetTimer();
      localStorage.removeItem("timerElapsed");
    },
    formatTime(time) {
      const hours = Math.floor(time / 3600000)
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((time % 3600000) / 60000)
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((time % 60000) / 1000)
        .toString()
        .padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }
  },
  beforeDestroy() {
    this.stopTimer();
  },
};
</script>
