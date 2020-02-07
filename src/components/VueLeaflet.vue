<template>
  <div class="vue-leaflet">
    <l-map style="width: 100%; height: 100%;" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="centerMaker" :icon="peopleMarkerIcon">
        <l-popup :content="text"></l-popup>
      </l-marker>
        <l-marker v-for="item in pharmacy" :icon="storeMarkerIcon" :key="item.properties.id" :lat-lng="transLatLng(item.geometry)">
          <l-popup :content="item.properties.name"></l-popup>
        </l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
// import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster';
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
    LPopup
    // Vue2LeafletMarkerCluster
  },
  data () {
    return {
      zoom: 13,
      center: window.L.latLng(47.413220, -1.219482),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      text: '我在這裡',
      centerMaker: window.L.latLng(47.413220, -1.219482),
      currentInfoWindow: null,
      markerCluster: null,
      makers: [],
      peopleMarkerIcon: window.L.icon({
        iconUrl: require('../assets/people.png'),
        store: require('../assets/med-stores_geojson.png')
      }),
      storeMarkerIcon: window.L.icon({
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
        const targetMaker = this.makers.find(maker => maker.data.id === value);
        if (targetMaker) {
          console.log(targetMaker);
          if (this.currentInfoWindow) this.currentInfoWindow.close();
          targetMaker.infowindow.open(this.map, targetMaker);
          this.currentInfoWindow = targetMaker.infowindow;
          this.map.panTo(targetMaker.position);
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
    transLatLng(geometry) {
      return window.L.latLng(geometry.coordinates[1], geometry.coordinates[0]);
    },
    async moveToLocationByAddress(address) {
      if (this.isDevicePosition) return;
      const results = await provider.search({ query: address });
      this.center = window.L.latLng(results[0].y, results[0].x);
      this.centerMaker = window.L.latLng(results[0].y, results[0].x);
    },
    moveToLocationByLatlang({ lat, lng }) {
      if (!this.isDevicePosition) return;
      const center = new window.google.maps.LatLng(lat, lng);
      this.centerMarker.setPosition(center);
      this.map.panTo(center);
    },
    // 放置 store 位置
    putStorePosition() {
      this.pharmacy.forEach((store, index) => {
        this.makers.push(this.setMarker(store));
      });
      this.markerCluster = new window.MarkerClusterer(this.map, this.makers, {
        gridSize: 50,
        maxZoom: 15,
        zoomOnClick: true,
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    },
    // 建立地標
    setMarker(store) {
      // 建立一個新地標
      const latLng = new window.google.maps.LatLng(
        store.geometry.coordinates[1],
        store.geometry.coordinates[0]
      );
      const marker = new window.google.maps.Marker({
        position: latLng,
        map: this.map,
        icon: './med-stores_geojson.png',
        data: store.properties
      });
      // 透過 InfoWindow 物件建構子建立新訊息視窗
      const infowindow = new window.google.maps.InfoWindow({
        // 設定想要顯示的內容
        content: `<span style="font-size: 22px;font-weight: bold;font-family: 'Avenir', '微軟正黑體', Helvetica, Arial, sans-serif;">
                    ${marker.data.name}
                  <span>`,
        // 設定訊息視窗最大寬度
        maxWidth: 200
      });
      marker.infowindow = infowindow;
      // 在地標上監聽點擊事件
      marker.addListener('click', () => {
        // 指定在哪個地圖和地標上開啟訊息視窗
        if (this.currentInfoWindow) this.currentInfoWindow.close();
        infowindow.open(this.map, marker);
        this.currentInfoWindow = infowindow;
        this.$emit('targetPhamercy', { ...marker.data });
      });
      return marker;
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
.vue-leaflet {
  width: 100%;
  height: 100vh;
  z-index: 0;
}
</style>
