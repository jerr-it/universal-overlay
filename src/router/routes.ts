import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'bluetooth',
        name: 'bluetooth',
        component: () => import('components/BluetoothComponent.vue')
      },
      {
        path: 'process_viewer',
        name: 'process_viewer',
        component: () => import('components/ProcessViewerComponent.vue')
      }
    ],
    redirect: { name: 'bluetooth' }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
