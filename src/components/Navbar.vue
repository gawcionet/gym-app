<template>
  <nav class="navbar">
    <ul class="navbar-list">
      <li class="navbar-item" :class="{ active: $route.path === '/programs' }">
        <router-link to="/programs" class="navbar-link">
          <span class="navbar-icon programs-icon"></span>
          Programs
        </router-link>
      </li>
      <li class="navbar-item" :class="{ active: $route.path === '/' }">
        <router-link to="/" class="navbar-link">
          <span class="navbar-icon training-icon"></span>
          Training
        </router-link>
      </li>
      <li class="navbar-item" :class="{ active: $route.path === '/statistics' }">
        <router-link to="/statistics" class="navbar-link">
          <span class="navbar-icon statistics-icon"></span>
          Statistics
        </router-link>
      </li>
      <li class="navbar-item">
        <div class="navbar-link" @click="handleSignOut">
          <span class="navbar-icon logout-icon"></span>
          Sign Out
        </div>
      </li>
    </ul>
  </nav>
</template>

<script>
import { auth } from "@/firebase/firebaseInit";
import router from "@/router";

export default {
  data() {
    return {
      activeTab: ""
    };
  },
  created() {
    this.activeTab = this.$route.path;
  },
  methods: {
    async handleSignOut() {
      try {
        const confirmed = window.confirm("Are you sure you want to sign out?");
        if (confirmed) {
          await auth.signOut();
          router.push("/signin");
          console.log("Successfully signed out!");
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>


<style scoped>
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
}

.navbar-list {
  display: flex;
  justify-content: space-around;
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.navbar-item {
  flex-basis: 0;
  flex-grow: 1;
  text-align: center;
}

.navbar-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s; /* Smooth transition for color change */
  position: relative; /* Add position relative for pseudo-element */
}

.navbar-icon {
  width: 48px;
  height: 48px;
  padding: 8px;
  background-repeat: no-repeat;
  background-size: contain;
  filter: invert(80%); /* Apply grayscale */
}

.programs-icon {
  background-image: url('@/assets/programs.svg');
}

.training-icon {
  background-image: url('@/assets/training.svg');
}

.statistics-icon {
  background-image: url('@/assets/statistics.svg');
}

.logout-icon {
  background-image: url('@/assets/logout.svg');
}

.navbar-link:hover::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: #292929; /* Dark gray */
  border-radius: 50%;
  z-index: -1;
}

.navbar-item.active .navbar-link {
  color: cyan;
}
.navbar-item.active .navbar-icon,
.navbar-item:hover .navbar-icon {
  filter: invert(26%) sepia(92%) saturate(6026%) hue-rotate(172deg) brightness(150%) contrast(102%);
}

/* Media Query for smaller screens */
@media (max-width: 600px) {
  .navbar-link {
    font-size: 12px;
  }

  .navbar-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
