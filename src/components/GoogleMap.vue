<template>
  <div id="map" class="embed-responsive embed-responsive-16by9 google-map"></div>
</template>

<script>
import mapStyle from '@/assets/mapStyle.json';
export default {
  props: {
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
  data() {
    return {
      map: null,
      centerMaker: null,
      currentInfoWindow: null,
      markerCluster: null,
      makers: [],
      nightMode: 'close', // 夜間模式：open開啟
      // 夜間模式的styles，資料來源：https://developers.google.com/maps/documentation/javascript/styling?hl=zh-tw
      nightModeStyles: mapStyle
    };
  },
  mounted() {
    this.initMap();
    this.moveToLocationByAddress(this.address);
  },
  watch: {
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
    },
    pharmacy: {
      deep: true,
      immediate: false,
      handler: function (value) {
        this.makers.forEach(function(e) {
          e.setMap(null);
        });
        if (this.markerCluster) {
          this.markerCluster.setMap(null);
          this.markerCluster.clearMarkers();
        }
        this.makers = [];
        this.putStorePosition();
      }
    }
  },
  methods: {
    // 建立地圖
    initMap() {
      // 透過 Map 物件建構子建立新地圖 map 物件實例，並將地圖呈現在 id 為 map 的元素中
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        disableDefaultUI: true,
        // 設定地圖的中心點經緯度位置
        center: { lat: 0, lng: 0 },
        // 設定地圖縮放比例 0-20
        zoom: 15,
        // 限制使用者能縮放地圖的最大比例
        maxZoom: 20,
        // 限制使用者能縮放地圖的最小比例
        minZoom: 3,
        // 設定是否呈現右下角街景小人
        streetViewControl: false,
        // 設定是否讓使用者可以切換地圖樣式：一般、衛星圖等
        mapTypeControl: false,
        styles: this.nightModeStyles
      });
      this.centerMarker = new window.google.maps.Marker({
        position: {
          lat: 0,
          lng: 0
        },
        icon: './people.png',
        animation: window.google.maps.Animation.DROP,
        map: this.map
      });
    },
    moveToLocationByAddress(address) {
      if (this.isDevicePosition) return;
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          this.map.panTo(results[0].geometry.location);
          this.centerMarker.setPosition(results[0].geometry.location);
        } else {
          console.log(status);
        }
      });
      // const center = new window.google.maps.LatLng(lat, lng);
      // this.centerMarker.setPosition(center);
      // this.map.panTo(center);
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
        content: `${marker.data.name}`,
        // 設定訊息視窗最大寬度
        maxWidth: 200
      });
      // 在地標上監聽點擊事件
      marker.addListener('click', () => {
        // 指定在哪個地圖和地標上開啟訊息視窗
        if (this.currentInfoWindow) this.currentInfoWindow.close();
        infowindow.open(this.map, marker);
        this.currentInfoWindow = infowindow;
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

<style lang="scss">
.google-map {
  width: 100%;
  height: 100vh;
}
</style>
