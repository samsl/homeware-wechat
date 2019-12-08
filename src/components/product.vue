<template>
  <van-card
    :thumb="product.imgUrl"
    :desc="product.capacity + ' ' + product.unit.name"
    :title="product.name"
    :num="product.ammount"
    :tag="product.productCategory.name"
  >
    <div slot="tags">
      <van-tag plain round type="danger">{{product.brand}}</van-tag>
    </div>
    <div slot="footer">
    <record-footer :speed="product.speed" :total="product.capacity*product.ammount" :id="product.id" :name="product.name" :imgUrl="product.imgUrl">    
    </record-footer>
    </div>
  </van-card>
</template>
<script>
import RecordFooter from "@/components/recordFooter"
export default {
  props: ["product"],  
  components: {
    RecordFooter
  }  
};
</script>
