<template>
  <div class="side-panel" :class="{ active: active }">
    <div class="information-panel">
       <div class="form-group">
        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" id="customSwitch1" @change="onCheckbox">
          <label class="custom-control-label" for="customSwitch1">使用目前位置</label>
        </div>
      </div>
      <CityAddress @onChangeAddress="onChangeAddress" :redirectAddress="redirectAddress" :isDevice="isDevice"/>
      <div>搜索附近或區域內總共有 {{ pharmacy.length }} 家藥局。</div>
      <div class="btn-group btn-group-toggle" data-toggle="buttons">
        <label class="btn btn-primary  btn-sm active">
          <input type="radio" name="options" id="option1" autocomplete="off" checked @click="() => { toggleHasMask(false) }"> 全部藥局
        </label>
        <label class="btn btn-primary  btn-sm">
          <input type="radio" name="options" id="option2" autocomplete="off" @click="() => { toggleHasMask(true) }"> 還有口罩({{ hasMaskPharmacy.length }})
        </label>
      </div>
      <div class="card-list" v-if="hasMaskActive">
        <PharmacyCard v-for="(item, index) in hasMaskPharmacy" :key="index + 'has'" :item="item" @onclick="cardClick" />
      </div>
      <div class="card-list" v-else>
        <PharmacyCard v-for="(item, index) in pharmacy" :key="index" :item="item" @onclick="cardClick" />
      </div>
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
import PharmacyCard from './PharmacyCard.vue';
export default {
  props: ['pharmacy', 'redirectAddress'],
  components: {
    CityAddress,
    PharmacyCard
  },
  data() {
    return {
      isDevice: false,
      iconList: [
        {
          name: 'map-marker-alt',
          className: 'fas fa-map-marker-alt',
          color: '#82c91e'
        }
      ],
      active: true,
      hasMaskActive: false,
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
      return this.active ? 'fas fa-times' : 'fas fa-external-link-alt';
    },
    hasMaskPharmacy() {
      return this.pharmacy.filter(item => item.properties.mask_adult > 0 || item.properties.mask_child > 0);
    }
  },
  methods: {
    changeInformationPanel() {
      this.active = true;
    },
    onChangeAddress(value) {
      this.addressObject = value;
    },
    cardClick(pharmacy) {
      this.$emit('targetPhamercy', pharmacy);
    },
    onCheckbox(e) {
      this.isDevice = e.target.checked;
      this.$emit('onIsDevice', e.target.checked);
    },
    toggleHasMask(value) {
      this.hasMaskActive = value;
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
  left: -320px;
  height: 100vh;
  z-index: 100;
  background-color: #fff;
  box-shadow: 0px 0px 5px rgba(black, 0.2);
  transition: .3s;
  &.active {
    left: 0px;
  }
}
.information-panel {
  display: flex;
  flex-direction: column;
  width: $information-width;
  height: 100vh;
  padding: 16px 0;
  transition: .3s;
  transition-delay: .1s;
}
.btn-group-toggle {
  width: 50%;
  label {
    font-size: 12px;
    border-radius: 0;
    opacity: 0.5;
    transition: .3s;
    &.active {
      opacity: 1;
    }
  }
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
.card-list {
  overflow: scroll;
}
</style>
