<template>
   <div class="movie-button">
    <van-button :type="type" @click="updateCurrent" round size="small">{{name}}</van-button>
    </div>
</template>
<script>
export default {
    props: ["index", "current", "name"],
    computed: {
        type() { 
        return this.current === this.index? "primary" : "default"
        }
    },
    methods: {
        updateCurrent() {
            this.$emit("updateCurrent", this.index);
        }
    }
}
</script>
<style>
    .movie-button {
        margin-right: 10rpx;
        width: 160rpx !important;
    }
</style>