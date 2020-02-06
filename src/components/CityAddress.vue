<template>
  <div class="container">
    <form>
      <div class="form-group">
        <div class="custom-control custom-switch">
          <input type="checkbox" class="custom-control-input" id="customSwitch1">
          <label class="custom-control-label" for="customSwitch1">使用目前位置</label>
        </div>
      </div>
      <h4 class="title">縣市搜尋</h4>
      <div class="row">
        <div class="col">
          <select id="inputCity" class="form-control form-control-sm" v-model="selectCity" @change="onChangeInput">
            <option v-for="(city, index) in filterCity" :key="index" :value="city">{{ city }}</option>
          </select>
        </div>
        <div class="col">
          <select id="inputCountry" class="form-control form-control-sm" v-model="selectCountry" @change="onChangeInput">
            <option value="all">選擇鄉鎮市區</option>
            <option v-for="(item, index) in filterCountry" :key="index" :value="item" @change="onChangeInput">{{ item }}</option>
          </select>
        </div>
      </div>
      <div class="form-group row mt-2">
        <div class="col-sm-12">
          <input type="text" class="form-control form-control-sm" id="colFormLabelSm" v-model="inputAddress" placeholder="街道地址或藥局名稱">
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cityArray: [],
      selectCity: '台北市',
      selectCountry: 'all',
      inputAddress: ''
    };
  },
  async mounted() {
    this.cityArray = await this.getXML('./city.json');
  },
  computed: {
    filterCity() {
       return this.cityArray.map(item => item.city).filter(function (element, index, arr) {
        return arr.indexOf(element) === index;
      });
    },
    filterCountry() {
       return this.cityArray.filter(city => city.city === this.selectCity).map(item => item.district);
    }
  },
  methods: {
    getXML(path) {
      return new Promise((resolve, reject) => {
        const oReq = new XMLHttpRequest();
        oReq.onload = function (e) {
          const data = JSON.parse(oReq.response);
          resolve(data);
        };
        oReq.open('GET', path);
        oReq.send();
      });
    },
    onChangeInput() {
      this.$emit('onChangeAddress', { city: this.selectCity, country: this.selectCountry, address: this.inputAddress });
    }
  }
};
</script>

<style lang="scss" scoped>
h4.title {
  text-align: left;
  font-size: 1rem;
}
</style>
