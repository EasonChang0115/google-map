<template>
  <div id="app" class="container-fluid">
    <div class="row">
      <InformationPanel @onChangePharmacy="onChangePharmacy" :pharmacy="filterPharmacy" @onIsDevice="onChangeIsDevicePosition" :redirectAddress="redirectAddress"
       @targetPhamercy="onTargetInforPharmacy" />
      <!-- <GoogleMap :pharmacy="filterPharmacy" :address="addressString" :isDevicePosition="isDevicePosition" @onAddress="onAddressFromLatLng" @targetPhamercy="onTargetPharmacy" :makerID="makerID"/> -->
      <VueLeaflet :pharmacy="filterPharmacy" :address="addressString" :isDevicePosition="isDevicePosition" @onAddress="onAddressFromLatLng" @targetPhamercy="onTargetPharmacy" :makerID="makerID" />
    </div>
    <DetailCard :phamarcy="pharmacyNow" :isOpen="isOpen" :closefunc="() => { isOpen = false; }"/>
   </div>
</template>

<script>
// import GoogleMap from './components/GoogleMap.vue';
import VueLeaflet from './components/VueLeaflet.vue';
import InformationPanel from './components/InformationPanel.vue';
import DetailCard from './components/DetailCard.vue';

export default {
  components: {
    // GoogleMap,
    VueLeaflet,
    InformationPanel,
    DetailCard
  },
  data() {
    return {
      pharmacy: [],
      filterPharmacy: [],
      isDevicePosition: false,
      redirectAddress: '',
      makerID: '',
      isOpen: false,
      addressInformtion: {
        city: '台北市',
        country: 'all',
        address: ''
      }
    };
  },
  mounted() {
    this.getStoreGeoPosition();
  },
  computed: {
    addressString () {
      return `${this.addressInformtion.city}${this.addressInformtion.country === 'all' ? '' : this.addressInformtion.country}${this.addressInformtion.address.trim()}`;
    },
    pharmacyNow () {
      const now = this.filterPharmacy.find(item => item.properties.id === this.makerID);
      if (now) return now.properties;
      return null;
    }
  },
  methods: {
    getStoreGeoPosition() {
      const urlPath = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR0b9mboKf0ib9sDhcj7WWFpT3LrWZ599j5fOMznNALGZrx8kggx6oNoYTc';
      fetch(urlPath)
        .then(results => results.json())
        .then(result => {
          // console.log(JSON.stringify(result));
          const res = result.features;
          this.pharmacy = res;
          this.onChangePharmacy();
      });
    },
    onChangePharmacy(addressInformtion) {
      if (addressInformtion) this.addressInformtion = addressInformtion;
      const filterPharmacyByAddress = this.pharmacy.filter((item) => item.properties.address.includes(this.addressString));
      const filterPharmacyByName = this.pharmacy.filter((item) => item.properties.name === this.addressInformtion.address);
      if (filterPharmacyByName.length > 0) {
        this.filterPharmacy = filterPharmacyByName;
      } else if (filterPharmacyByAddress.length === 0 && filterPharmacyByName.length === 0) {
        const areaString = `${this.addressInformtion.city}${this.addressInformtion.country === 'all' ? '' : this.addressInformtion.country}`;
        this.filterPharmacy = this.pharmacy.filter((item) => item.properties.address.includes(areaString));
      } else {
        this.filterPharmacy = filterPharmacyByAddress;
      }
    },
    onChangeIsDevicePosition(value) {
      this.isDevicePosition = value;
    },
    onAddressFromLatLng(value) {
      this.redirectAddress = value;
    },
    onTargetInforPharmacy(target) {
      this.makerID = target.id;
      this.onTargetPharmacy(target);
    },
    onTargetPharmacy(target) {
      this.makerID = target.id;
      this.isOpen = true;
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
  font-family: 'Avenir', '微軟正黑體', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
