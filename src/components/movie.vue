<template>
  <van-card :thumb="movie.post">
    <div slot="title" class="title">{{movie.name}}</div>
    <div slot="desc">
      <div class="rating-line">
        <div class="rating-start">
          <van-rate :value="rating" />
        </div>
        <div class="rating-number">{{movie.rating}}</div>
      </div>
    </div>
    <div slot="tags" class="movie-desc">{{description}}</div>
  </van-card>
</template>
<script>
export default {
  props: ["movie"],
  computed: {
    rating() {
      return Math.round(this.movie.rating) / 2;
    },
    description() {
      const items = [];
      const movie = this.movie;
      if (movie.year) {
        items.push(movie.year);
      }
      const regions = movie.regions.join(" ");
      if (regions) {
        items.push(regions);
      }
      const genres = movie.genres.join(" ");
      if (genres) {
        items.push(genres);
      }
      const directors = movie.director.join(" ");
      if (directors) {
        items.push(directors);
      }
      let castArray = movie.cast;
      if (castArray.length > 2) {
        castArray = castArray.slice(0, 2);
      }
      const cast = castArray.join(" ");
      if (cast) {
        items.push(cast);
      }
      return items.join(" / ");
    }
  }
};
</script>
<style>
.rating-line {
  display: flex;
  align-items: center;
}
.rating-star {
  height: 50rpx;
}
.rating-number {
  height: 50rpx;
  color: orange;
  display: flex;
  align-items: center;
}
.title {
  font-size: 30rpx;
}
.movie-desc {
  color: #666;
  font-size: 20rpx;
}
</style>
