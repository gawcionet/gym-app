import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './css/global.css'
import { waitForAuth } from '@/firebase/firebaseInit';

// createApp(App).use(router).mount('#app')

const app = createApp(App);

waitForAuth().then((user) => {
    if (user) {
      // User is logged in, show home page
      router.push('/');
    } else {
      // User is not logged in, show sign in page
      router.push('/signin');
    }
  
    app.use(router).mount('#app');
});