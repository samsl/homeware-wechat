<template>
  <div class="footer">
    <div class="progress-section">
      <van-progress
        :percentage="percentage"
        :pivot-text="usagetime"
        :color="color"
        class="progress"
      />
    </div>
    <div class="button">
      <van-button
        size="small"
        plain
        type="primary"
        @click.stop="addUseRecord(id, name, imgUrl, category)"       
      >添加使用记录</van-button>
    </div>
  </div>
</template>
<script>
export default {
  props: ["speed", "total", "id", "name", "imgUrl","category"],
  data() {
    return {
      colors: ["#07c160", "#ff976a", "#f44", "#ababab"]
    };
  },

  computed: {
    usagetime() {
      if (this.speed === 0 || this.speed === null) {
        return "99天";
      } else {
        const time = this.total / this.speed;
        const parseDay = this.getTime(time, 1);
        const days = parseDay[0];
        const parseHour = this.getTime(parseDay[1], 24);
        const hours = parseHour[0];
        const parseMin = this.getTime(parseHour[1], 60);
        const mins = parseMin[0];
        const parseSecond = this.getTime(parseMin[1], 60);
        const secs = parseSecond[0];
        return `预计剩余${days}天${hours}小时${mins}分${secs}秒`;
      }
    },
    color() {
      if (this.percentage > 90) {
        return this.colors[0];
      } else if (this.percentage > 30) {
        return this.colors[1];
      } else if (this.percentage > 0) {
        return this.colors[2];
      }
      return this.colors[3];
    },
    percentage() {
      if (this.speed === 0 || this.speed === null) {
        return 100;
      } else {
        const time = this.total / this.speed;
        let percentage = time / 30;
        if (percentage > 1) {
          return 100;
        } else {
          return Math.floor(percentage * 100);
        }
      }
    }
  },
  methods: {
    addUseRecord(id, name, img, category) {
      const url = `/pages/record/main?id=${id}&name=${name}&img=${img}&category=${category}`;
      wx.navigateTo({ url });
    },
    getTime(time, unit) {
      const scale = time * unit;
      const integer = Math.floor(scale);
      const decimal = scale - integer;
      return [integer, decimal];
    }
  }
};
</script>
<style>
.footer {
  margin: 30rpx 0;
  display: flex;
  justify-content: space-between;
}
.progress-section {
  width: 70%;
  display: flex;
  align-items: center;
}
.progress {
  width: 100%;
}
.button {
  width: 30%;
}
</style>