<template>
  <div class="block" v-if="phamarcy && isOpen" @click.stop="closefunc">
    <div class="detail-card" @click.stop>
      <div class="bgc"></div>
      <div class="close" @click.stop="closefunc">
        <i class="fas fa-times"></i>
      </div>
      <h3 class="title p-n">{{ phamarcy.name }}</h3>
      <div class="mask_number">
        <div class="adult">成人口罩：{{ phamarcy.mask_adult ? phamarcy.mask_adult : '尚無資料' }}</div>
        <div class="child">小孩口罩：{{ phamarcy.mask_child ? phamarcy.mask_child : '尚無資料' }}</div>
      </div>
      <div class="phone">電話：{{ phamarcy.phone }}</div>
      <div class="address">地址： <a :href='link' target="_blank">{{ phamarcy.address }}</a></div>
      <h3 class="title mt-3">營業時間</h3>
      <div class="available">
        <table class="table table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">星期日</th>
              <th scope="col">星期一</th>
              <th scope="col">星期二</th>
              <th scope="col">星期三</th>
              <th scope="col">星期四</th>
              <th scope="col">星期五</th>
              <th scope="col">星期六</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(time, index) in availableTable" :key="index">
              <td>{{ index === 0 ? '上午' : index === 1 ? '下午' : '晚上' }}</td>
              <td v-for="item in time" :key="item.name">{{ item.available }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="note">{{ phamarcy.note }}<br>{{ phamarcy.custom_note }}</div>
      <div class="website" v-if="phamarcy.website.length > 0">地址： <a :href='hamarcy.website' target="_blank">{{ phamarcy.website }}</a></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['phamarcy', 'isOpen', 'closefunc'],
  computed: {
    link() {
      return `https://www.google.com.tw/maps/place/${this.phamarcy.address}`;
    },
    availableTable() {
      const availableArray = this.phamarcy.available.split('、');
      const timeArray = [
        [{ name: '星期日上午' }, { name: '星期一上午' }, { name: '星期二上午' }, { name: '星期三上午' }, { name: '星期四上午' }, { name: '星期五上午' }, { name: '星期六上午' }],
        [{ name: '星期日下午' }, { name: '星期一下午' }, { name: '星期二下午' }, { name: '星期三下午' }, { name: '星期四下午' }, { name: '星期五下午' }, { name: '星期六下午' }],
        [{ name: '星期日晚上' }, { name: '星期一晚上' }, { name: '星期二晚上' }, { name: '星期三晚上' }, { name: '星期四晚上' }, { name: '星期五晚上' }, { name: '星期六晚上' }]
      ];
      timeArray.forEach(week => {
        week.forEach(item => {
          availableArray.forEach(string => {
            if (string.substr(0, 5) === item.name) item.available = string.substr(5, 2);
          });
        });
      });
      return timeArray;
    }
  }
};
</script>

<style lang="scss" scoped>
.block {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(black, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101;
}
.detail-card {
  position: relative;
  background-color: #fff;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-radius: 5px;
  .bgc {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 100%;
    height: 100%;
    background-image: url('../assets/Attachlogo.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.08;
  }
  .close {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
  }
  .title {
    font-size: 22px;
    font-weight: bold;
    &.p-n {
      font-size: 26px;
    }
  }
  .available {
    border: 1px solid grey;
  }
  .mask_number {
    color: rgba(red, 0.8);
    width: 100%;
    background-color: rgba(red, 0.1);
    font-size: 18px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .phone, .address, .note, .website {
    font-size: 16px;
    font-weight: normal;
  }
}
</style>
