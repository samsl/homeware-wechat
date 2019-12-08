<template>
  <div>
    <div v-show="useRecords.length===0" class="default-use-records">
      <van-icon name="todo-list-o" size="3em"/>
      <span>暂无使用记录</span>
    </div>

    <div v-for="useRecord in useRecords" :key="useRecord" class="use-record">
      <van-card
        :thumb="useRecord.item.imgUrl"
        :title="useRecord.item.name"
        :desc="useRecord.item.capacity + unit"
        :tag="useRecord.purpose"
      >
        <div slot="tags">
          <div v-if="useRecord.status==='NEW'" class="footer">
            <div class="date">开始时间: {{useRecord.startDateFormatted}}</div>
            <div>
              <van-button size="mini" plain type="primary" @click="show=true;active=useRecord">完成</van-button>
            </div>
          </div>
          <div v-else class="dates">
            <div class="date">
              <van-tag plain round type="danger">{{useRecord.speed}} {{unit}}/天</van-tag>
            </div>
            <div
              class="date"
            >使用时间: {{useRecord.startDateFormatted}} ~ {{useRecord.endDateFormatted}}</div>
          </div>
        </div>
      </van-card>
    </div>
    <van-popup :show="show" position="right" @close="show=false" custom-style="width:100%">
      <van-datetime-picker
        title="结束日期"
        type="date"
        :value="finishedDate"
        @cancel="show=false"
        @confirm="submit"
      />
    </van-popup>
  </div>
</template>
<script>
import UseRecordService from "@/api/useRecordService";
export default {
  props: ["useRecords", "unit"],
  data() {
    return {
      show: false,

      active: {},
      finishedDate: new Date().getTime()
    };
  },
  methods: {
    submit(event) {
      this.finishedDate = event.mp.detail;
      this.show = false;
      let category;
      if (this.unit === '页') {
        category = 'book';
      }
      UseRecordService.updateUseRecord(
        this.active.item.id,
        this.active.startDate,
        this.finishedDate,
        this.active.id,
        category
      )
        .then(response => {
          this.$emit("refreshRecord");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style>
.footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0px;
}
.dates {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0px;
}
.date {
  margin-top: 10rpx;
}
.use-record {
  margin-bottom: 10rpx;
}
.default-use-records {
  color: #ababab;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 30rpx 0rpx;
}
</style>