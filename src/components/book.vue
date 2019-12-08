<template>
  <van-card :thumb="book.imgUrl" :desc="book.press" :title="book.name" :tag="'书'">
    <div slot="tags">
      <van-tag plain round type="danger">{{publishDate}}</van-tag>
    </div>
    <div slot="footer">
    <record-footer :speed="book.speed" :total="book.pages" :id="book.id" :name="book.name" :imgUrl="book.imgUrl" category="book">     
    </record-footer>
    </div>
  </van-card>
</template>
<script>
import Utils from "@/utils/index";
import RecordFooter from "@/components/recordFooter";
export default {
  props: ["book"],  
  components: {
    RecordFooter
  },
  computed: {
    publishDate() {
      return Utils.formatDate(this.book.publishDate);
    }
  }
};
</script>
