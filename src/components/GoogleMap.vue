<template>
  <div id="app" class="container">
    <div class="row">
      <div class="col">
        <div id="map" class="embed-responsive embed-responsive-16by9"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      marker: null,
      // 預設經緯度在信義區附近
      lat: 25.0325917,
      lng: 121.5624999
    };
  },
  mounted() {
    this.getPosition(() => {
      this.initMap();
      this.setMarker();
    });
  },
  methods: {
    // 建立地圖
    initMap() {
      // 透過 Map 物件建構子建立新地圖 map 物件實例，並將地圖呈現在 id 為 map 的元素中
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        // 設定地圖的中心點經緯度位置
        center: { lat: this.lat, lng: this.lng },
        // 設定地圖縮放比例 0-20
        zoom: 15,
        // 限制使用者能縮放地圖的最大比例
        maxZoom: 20,
        // 限制使用者能縮放地圖的最小比例
        minZoom: 3,
        // 設定是否呈現右下角街景小人
        streetViewControl: false,
        // 設定是否讓使用者可以切換地圖樣式：一般、衛星圖等
        mapTypeControl: false
      });
    },
    // 建立地標
    setMarker() {
      // 建立一個新地標
      this.marker = new window.google.maps.Marker({
        // 設定地標的座標
        position: { lat: this.lat, lng: this.lng },
        // 設定地標要放在哪一個地圖
        map: this.map
      });
    },
    async getPosition (callback) {
      const position = await this.getCoordinates();
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      callback();
    },
    getCoordinates() {
      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    }
  }
};
</script>

<style lang="scss">
.google-map {
  width: 100%;
  height: 400px;
}
</style>
