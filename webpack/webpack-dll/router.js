import Router from 'vue-router';

import aa from './a.vue';

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/a'
    },
    {
      name: 'a',
      path: '/a',
      component: aa
    }
  ]
});