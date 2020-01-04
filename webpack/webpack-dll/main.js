import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import app from './app.vue';
import router from './router';

new Vue({
  router,
  render: (h) => h(app)
}).$mount('.app');