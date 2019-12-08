<template>
  <van-tabs active="0">
    <van-tab title="使用中">
      <use-records :use-records="newRecords" :unit="unit" @refreshRecord="loadUseRecord"/>
    </van-tab>
    <van-tab title="已使用">
      <use-records :use-records="doneRecords" :unit="unit" @refreshRecord="loadUseRecord"/>
    </van-tab>
  </van-tabs>
</template>
<script>
import UseRecordService from "@/api/useRecordService";
import UseRecords from "@/components/useRecords";
import Utils from "@/utils/index"
export default {
  data() {
    return {
      useRecords: [],
      unit:''
    };
  },
  onShow() {
    this.loadUseRecord();
  },
  components: {
    UseRecords
  },
  mounted() {},
  computed: {
    newRecords() {
      return this.useRecords.filter(u=>u.status==='NEW')
    },
    doneRecords(){
      return this.useRecords.filter(u=>u.status==='DONE')
    }
  },
  methods: {
    loadUseRecord() {
      this.unit = this.$root.$mp.query.unit;
      const productId = this.$root.$mp.query.id;
      const category = this.$root.$mp.query.category;

      wx.setNavigationBarTitle({
        title: this.$root.$mp.query.name
      });
      UseRecordService.getUseRecord(productId, category)
        .then(response => {
          this.useRecords = response.data.data;
          this.useRecords.forEach(element => {
            if (element.startDate !== "") {
              element.startDateFormatted = Utils.formatDate(
                element.startDate
              );
            }
            if (element.endDate) {
              element.endDateFormatted = Utils.formatDate(
                element.endDate
              );
            }
            if (element.book !== null) {
              element.item = element.book;
              element.item.capacity = element.book.pages;
            } else {
              element.item = element.product;
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style>
</style>