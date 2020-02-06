<template>
  <div id="map" class="embed-responsive embed-responsive-16by9 google-map"></div>
</template>

<script>
export default {
  props: {
    pharmacy: {
      type: Array,
      default: function() {
        return [];
      }
    },
    devicePosition: {
      type: Object,
      default: function() {
        return {
          lat: 25.0325917,
          lng: 121.5624999
        };
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
      nightModeStyles: [
        {
          elementType: 'geometry',
          stylers: [
            {
              color: '#1d2c4d'
            }
          ]
        },
        {
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#8ec3b9'
            }
          ]
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [
            {
              color: '#1a3646'
            }
          ]
        },
        {
          featureType: 'administrative.country',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#4b6878'
            }
          ]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#64779e'
            }
          ]
        },
        {
          featureType: 'administrative.province',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#4b6878'
            }
          ]
        },
        {
          featureType: 'landscape.man_made',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#334e87'
            }
          ]
        },
        {
          featureType: 'landscape.natural',
          elementType: 'geometry',
          stylers: [
            {
              color: '#023e58'
            }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
            {
              color: '#283d6a'
            }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#6f9ba5'
            }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.stroke',
          stylers: [
            {
              color: '#1d2c4d'
            }
          ]
        },
        {
          featureType: 'poi.business',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#023e58'
            }
          ]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#3C7680'
            }
          ]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [
            {
              color: '#304a7d'
            }
          ]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#98a5be'
            }
          ]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.stroke',
          stylers: [
            {
              color: '#1d2c4d'
            }
          ]
        },
        {
          featureType: 'road.arterial',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [
            {
              color: '#2c6675'
            }
          ]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#255763'
            }
          ]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#b0d5ce'
            }
          ]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.stroke',
          stylers: [
            {
              color: '#023e58'
            }
          ]
        },
        {
          featureType: 'road.local',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'transit',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#98a5be'
            }
          ]
        },
        {
          featureType: 'transit',
          elementType: 'labels.text.stroke',
          stylers: [
            {
              color: '#1d2c4d'
            }
          ]
        },
        {
          featureType: 'transit.line',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#283d6a'
            }
          ]
        },
        {
          featureType: 'transit.station',
          elementType: 'geometry',
          stylers: [
            {
              color: '#3a4762'
            }
          ]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [
            {
              color: '#0e1626'
            }
          ]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#4e6d70'
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.initMap();
  },
  watch: {
    devicePosition: {
      immediate: false,
      deep: true,
      handler: function(value) {
        this.moveToLocation(value);
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
        center: { lat: this.devicePosition.lat, lng: this.devicePosition.lng },
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
          lat: this.devicePosition.lat,
          lng: this.devicePosition.lng
        },
        map: this.map
      });
    },
    moveToLocation({ lat, lng }) {
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
