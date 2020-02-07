<template>
  <div class="vue-leaflet">
    <l-map style="width: 100%; height: 100%;" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="centerMaker" :icon="peopleMarkerIcon">
        <l-popup :content="text"></l-popup>
      </l-marker>
      <v-marker-cluster>
        <l-marker v-for="item in pharmacy" :icon="storeMarkerIcon" :key="item.properties.id" :lat-lng="transLatLng(item.geometry)" @click="clickMarker(item.properties)">
          <l-popup :content="item.properties.name"></l-popup>
        </l-marker>
      </v-marker-cluster>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster';
import L from 'leaflet';
const provider = new OpenStreetMapProvider();

export default {
  name: 'VueLeaflet',
  props: {
    makerID: {
      type: String || Number
    },
    address: {
      type: String
    },
    isDevicePosition: {
      type: Boolean,
      default: function () {
        return false;
      }
    },
    pharmacy: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    'v-marker-cluster': Vue2LeafletMarkerCluster
  },
  data () {
    return {
      zoom: 13,
      center: L.latLng(47.413220, -1.219482),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      text: '我在這裡',
      centerMaker: L.latLng(47.413220, -1.219482),
      currentInfoWindow: null,
      markerCluster: null,
      makers: [],
      peopleMarkerIcon: L.icon({
        iconUrl: require('../assets/people.png'),
        store: require('../assets/med-stores_geojson.png')
      }),
      storeMarkerIcon: L.icon({
        iconUrl: require('../assets/med-stores_geojson.png')
      })
    };
  },
  mounted() {
    this.moveToLocationByAddress(this.address);
  },
  watch: {
    makerID: {
      immediate: false,
      handler: function(value) {
        const targetMaker = this.pharmacy.find(pharmacy => pharmacy.properties.id === value);
        if (targetMaker) {
          this.zoom = 200;
          this.center = L.latLng(targetMaker.geometry.coordinates[1], targetMaker.geometry.coordinates[0]);
          this.centerMarker = L.latLng(targetMaker.geometry.coordinates[1], targetMaker.geometry.coordinates[0]);
        }
      }
    },
    isDevicePosition: {
      immediate: true,
      handler: function(value) {
        if (value) this.getDevicePosition();
        else this.moveToLocationByAddress(this.address);
      }
    },
    address: {
      immediate: false,
      deep: true,
      handler: function(value) {
        this.moveToLocationByAddress(value);
      }
    }
  },
  methods: {
    clickMarker(data) {
      this.$emit('targetPhamercy', { ...data });
    },
    transLatLng(geometry) {
      return L.latLng(geometry.coordinates[1], geometry.coordinates[0]);
    },
    async moveToLocationByAddress(address) {
      if (this.isDevicePosition) return;
      const results = await provider.search({ query: address });
      this.center = L.latLng(results[0].y, results[0].x);
      this.centerMaker = L.latLng(results[0].y, results[0].x);
    },
    moveToLocationByLatlang({ lat, lng }) {
      if (!this.isDevicePosition) return;
      this.center = L.latLng(lat, lng);
      this.centerMaker = L.latLng(lat, lng);
    },
    async getDevicePosition () {
      // 獲取當下裝置的位置
      try {
        const position = await this.getCoordinates();
        this.moveToLocationByLatlang({ lat: position.coords.latitude, lng: position.coords.longitude });
        const address = await this.getAddressBylatlng({ lat: position.coords.latitude, lng: position.coords.longitude });
        this.$emit('onAddress', { address });
      } catch (error) {
        console.log('Sorry, 你的裝置不支援地理位置功能。');
      }
    },
    getCoordinates() {
      return new Promise(function(resolve, reject) {
        // 先確認使用者裝置能不能抓地點
        if (navigator.geolocation) {
          // 跟使用者拿所在位置的權限
          navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('');
        }
      });
    },
    getAddressBylatlng({ lat, lng }) {
      return new Promise(function(resolve, reject) {
        const urlString = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBnKkl6dGZWe8e4povyqsv6_hnzraiPCXU&latlng=${lat},${lng}&language=zh-TW`;
        fetch(urlString).then(result => result.json()).then(res => {
          resolve(res.results[0].formatted_address);
        }).catch(e => {
          reject(e);
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
.vue-leaflet {
  width: 100%;
  height: 100vh;
  z-index: 0;
}
</style>
