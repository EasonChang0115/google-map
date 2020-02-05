import Vue from 'vue';
import App from './App.vue';

import 'bootstrap'; // Import js file
import 'bootstrap/dist/css/bootstrap.min.css'; // Import css file

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
