<template>
  <div>
    <h4>{{ item['name'] }}</h4>
    <br>
    口罩剩餘：
    <strong>{{ `成人 - ${item['adultMask']? item['adultMask'] + ' 個': '未取得資料'}/ 兒童 - ${item['childMask']? item['childMask'] + ' 個': '未取得資料'}` }}</strong>
    <br>
    地址: <a :href='link' target="_blank">{{ item['address'] }}</a>
    <br>
    電話: {{ item['tel'] }}
    <br>
    <small>最後更新時間: {{ item['updateTime'] }}</small>
    <hr>
  </div>
</template>

<script>
export default {
  computed: {
    link() {
      return `https://www.google.com.tw/maps/place/${this.item.address}`;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
