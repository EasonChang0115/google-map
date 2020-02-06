<template>
  <div class="card" @click="cardClick">
    <h4>{{ properties['name'] }}</h4>
    <div class="mask-block">
      口罩剩餘：
      <strong>{{ `成人 - ${properties['mask_adult']? properties['mask_adult'] + ' 個': '未取得資料'} / ` }}</strong>
      <strong>{{ `兒童 - ${properties['mask_child']? properties['mask_child'] + ' 個': '未取得資料'}` }}</strong>
    </div>
    <div>地址: <a :href='link' target="_blank">{{ properties['address'] }}</a></div>
    <div>電話: {{ properties['phone'] }}</div>
    <div>最後更新時間: {{ properties['updated'] }}</div>
  </div>
</template>

<script>
export default {
  props: ['item'],
  computed: {
    properties() {
      return this.item.properties;
    },
    link() {
      return `https://www.google.com.tw/maps/place/${this.properties.address}`;
    }
  },
  methods: {
    cardClick() {
      this.$emit('onclick', { id: this.item.properties.id, geometry: this.item.geometry });
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 4px;
  cursor: pointer;
  transition: .3s;
  &:hover {
    background-color: rgba(green, 0.05);
  }
  h4 {
    font-size: 1rem;
    font-weight: bold;
    background-color: rgba(blue, 0.1);
    border-radius: 5px;
  }
  .mask-block {
    background-color: rgba(red, 0.1);
  }
  display: flex;
  padding: 8px 16px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
</style>
