<template>
  <div id="app" class="container-fluid">
    <div class="row">
      <InformationPanel />
      <GoogleMap :pharmacy="pharmacy" :devicePosition="devicePosition" :key="pharmacy.length"/>
    </div>
   </div>
</template>

<script>
import GoogleMap from './components/GoogleMap.vue';
import InformationPanel from './components/InformationPanel.vue';

export default {
  components: {
    GoogleMap,
    InformationPanel
  },
  data() {
    return {
      pharmacy: [],
      devicePosition: {
        lat: 25.0325917,
        lng: 121.5624999
      }
    };
  },
  mounted() {
    this.getStoreGeoPosition();
    this.getPosition();
  },
  methods: {
    getStoreGeoPosition() {
      fetch('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR0b9mboKf0ib9sDhcj7WWFpT3LrWZ599j5fOMznNALGZrx8kggx6oNoYTc')
        .then(results => results.json())
        .then(result => {
          const res = result.features;
          this.pharmacy = res;
      });
    },
    async getPosition () {
      // 獲取當下裝置的位置
      const position = await this.getCoordinates();
      this.devicePosition.lat = position.coords.latitude;
      this.devicePosition.lng = position.coords.longitude;
    },
    getCoordinates() {
      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
body, html, #app {
  height: 100%;
  width: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
