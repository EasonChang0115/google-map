<template>
  <div class="side-panel" :class="{ active: active }">
    <div class="information-panel">
      <CityAddress @onChangeAddress="onChangeAddress" />
    </div>
    <div class="control-panel">
      <ul class="icon-list">
        <li :class="closeBtnClass" :style="{ backgroundColor: '#3498DB' }" @click="active = !active"></li>
        <li v-for="item in iconList" :key="item.name" :class="item.className" :style="{ backgroundColor: item.color }" @click="changeInformationPanel"></li>
      </ul>
    </div>
  </div>
</template>

<script>
import CityAddress from './CityAddress.vue';
export default {
  components: {
    CityAddress
  },
  data() {
    return {
      iconList: [
        {
          name: 'map-marker-alt',
          className: 'fas fa-map-marker-alt',
          color: '#82c91e'
        }
      ],
      active: true,
      addressObject: {
        city: '台北市',
        country: 'all',
        address: ''
      }
    };
  },
  watch: {
    addressObject: {
      deep: true,
      immediate: false,
      handler: function(value) {
        this.$emit('onChangePharmacy', value);
      }
    }
  },
  computed: {
    closeBtnClass() {
      return this.active ? 'fas fa-external-link-alt' : 'fas fa-times';
    }
  },
  methods: {
    changeInformationPanel() {
      this.active = true;
    },
    onChangeAddress(value) {
      this.addressObject = value;
    }
  }
};
</script>

<style lang="scss" scoped>
$control-width: 50px;
$information-width: 320px;
.side-panel {
  position: fixed;
  display: flex;
  left: 0;
  height: 100vh;
  z-index: 100;
  background-color: #fff;
  box-shadow: 0px 0px 5px rgba(black, 0.2);
  transition: .3s;
  &.active {
    left: -320px;
  }
}
.information-panel {
  width: $information-width;
  height: 100vh;
  padding: 16px 0;
  transition: .3s;
  transition-delay: .1s;
}
.control-panel {
  width: $control-width;
  height: 100vh;
  background-color: rgba(grey, 0.1);
  ul.icon-list {
    padding: 0;
    margin: 0;
    list-style: none;
    li {
      padding: 5px 0px;
      width: $control-width;
      height: $control-width;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      cursor: pointer;
      transition: .3s;
      &:hover {
        color: grey;
      }
    }
  }
}
</style>
