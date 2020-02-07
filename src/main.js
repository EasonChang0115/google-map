import Vue from 'vue';
import App from './App.vue';
import L from 'leaflet';

import 'bootstrap'; // Import js file
import 'bootstrap/dist/css/bootstrap.min.css'; // Import css file

import 'leaflet/dist/leaflet.css';

/* leaflet icon */
// eslint-disable-next-line no-undef
delete L.Icon.Default.prototype._getIconUrl;
// eslint-disable-next-line no-undef
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');
