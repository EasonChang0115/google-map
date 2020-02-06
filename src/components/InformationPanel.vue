<template>
  <div class="side-panel" :class="{ active: active }">
    <div class="information-panel"></div>
    <div class="control-panel">
      <ul class="icon-list">
        <li :class="closeBtnClass" :style="{ backgroundColor: '#3498DB' }" @click="active = !active"></li>
        <li v-for="item in iconList" :key="item.name" :class="item.className" :style="{ backgroundColor: item.color }" @click="changeInformationPanel"></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iconList: [
        {
          name: 'map-marker-alt',
          className: 'fas fa-map-marker-alt',
          color: '#82c91e'
        }
      ],
      active: true
    };
  },
  computed: {
    closeBtnClass() {
      return this.active ? 'fas fa-external-link-alt' : 'fas fa-times';
    }
  },
  methods: {
    changeInformationPanel() {
      this.active = true;
    }
  }
};
</script>

<style lang="scss" scoped>
$control-width: 50px;
$information-width: 270px;
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
    .information-panel {
      width: $information-width;
    }
  }
}
.information-panel {
  width: 0;
  height: 100vh;
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
