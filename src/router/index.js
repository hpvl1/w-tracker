import { createRouter, createWebHistory } from 'vue-router';

import { ROUTES_PATHS } from '../constants';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: ROUTES_PATHS.HOME,
      name: ROUTES_PATHS.HOME,
      component: () => import('../views/Home.vue'),
    },
  ],
});


export default router;
