import { createRouter, createWebHashHistory } from 'vue-router'
import { auth } from '../firebase/firebaseInit';
import ProgramsView from '@/views/programs/ProgramsView.vue'
import EditProgramView from "@/views/programs/EditProgramView.vue";
import EditDayView from "@/views/programs/EditDayView.vue";
import TrainingView from '@/views/training/TrainingView.vue'
import TrainingDaysView from "@/views/training/TrainingDaysView.vue";
import TrainView from "@/views/training/TrainView.vue";
import TrainExerciseView from "@/views/training/TrainExerciseView.vue";
import StatisticsView from '@/views/statistics/StatisticsView.vue'
import HistoryView from '@/views/statistics/HistoryView.vue'
import HistoryDetailsView from '@/views/statistics/HistoryDetailsView.vue'
import AnalysisView from '@/views/statistics/AnalysisView.vue'
import SignInView from '@/views/SignInView.vue';

const routes = [
  {
    path: '/',
    name: 'training',
    component: TrainingView,
    meta: { requiresAuth: true }
  },
  {
    path: "/:id",
    name: "trainingdays",
    component: TrainingDaysView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: "/training/:tActiveId",
    name: "train",
    component: TrainView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: "/training/:tActiveId/:index",
    name: "trainexercise",
    component: TrainExerciseView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/programs',
    name: 'programs',
    component: ProgramsView,
    meta: { requiresAuth: true }

  },
  {
    path: "/programs/:id",
    name: "editprogram",
    component: EditProgramView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: "/programs/:id/:dayId",
    name: "editday",
    component: EditDayView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: StatisticsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/statistics/history',
    name: 'history',
    component: HistoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/statistics/history/:id',
    name: 'historydetails',
    component: HistoryDetailsView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/statistics/analysis',
    name: 'analysis',
    component: AnalysisView,
    meta: { requiresAuth: true }
  },
  {
    path: '/signin',
    name: 'signin',
    component: SignInView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = auth.currentUser;
  
  if (requiresAuth && !currentUser) {
    next('/signin');
  } else {
    next();
  }
});

export default router;
