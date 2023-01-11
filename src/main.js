import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faChartPie, faChartBar,
  faHamburger, faFire, faHandSparkles, faVirus,
  faPeopleArrows, faDatabase, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

library.add(faHome);
library.add(faGithub);
library.add(faChartPie);
library.add(faChartBar);
library.add(faHamburger);
library.add(faFire);
library.add(faHandSparkles);
library.add(faVirus);
library.add(faPeopleArrows);
library.add(faDatabase);
library.add(faCalendarDay);

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
