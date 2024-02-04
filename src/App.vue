<template>
  <div>
    <router-view/>
    <Navbar v-if="loggedIn" />
  </div>
</template>

<script>
  import Navbar from '@/components/Navbar.vue';
  import { onMounted, ref } from 'vue';
  import { auth } from '@/firebase/firebaseInit';

  export default {
    components: {
      Navbar
    },
    setup() {
      const loggedIn = ref(false);

      onMounted(() => {
        auth.onAuthStateChanged(user => {
          loggedIn.value = user !== null;
        });
      });

      return { loggedIn };
    }
  };
</script>
