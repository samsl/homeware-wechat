<template>
  <div class="movie">
    <div class="movie-card">
    <van-card :thumb="movie.post" :tag="idx+1">
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
       </div>
    <div class="movie-status passed" v-show="watched">
      <div>
        <van-icon name="passed" />
      </div>
      <div>{{formatDate}}</div>
    </div>
    <div class="movie-status" v-show="!watched" @click="dateShow=true">
      <div>
        <van-icon name="like-o" />
      </div>
      <div>已看</div>
    </div>
        <van-popup :show="dateShow" position="bottom" @close="dateShow=false">
      <van-datetime-picker :value="defaultDate" title="选择观看日期" type="date" @cancel="dateShow=false" @confirm="chooseDate"/>
    </van-popup>
  </div>
</template>
<script>
import MovieService from "@/api/movieservice";
import Utils from "@/utils/index";
import {mapState} from "vuex"
export default {
  props: ["movie", "idx", "records"],
  data() {
      return {
          record:{},
          dateShow: false
      }
  },
  mounted() {
      if (this.records[this.movieId] != undefined) {
          this.record = this.records[this.movieId];
      }
  },
  computed: {
      formatDate() {
          if (Object.keys(this.record).length === 0) {
              return '';
          }
          const dataString = Utils.formatDate(this.record.watchedDate);
          
          return dataString.split("-")[0];
      },
      watched(){       
        return Object.keys(this.record).length;      
          
      },
    movieId() {
        return `${this.movie.director.join("-")}-${this.movie.name}-${this.movie.year}`;
    },
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
    },
    ...mapState(["userId"])
  
  },
  methods: {
    chooseDate(event) {
        const watchedRecord = {
        watchedDate: event.mp.detail,
        movieId: this.movieId,
        userId: this.userId
        }
        MovieService.addWatch(watchedRecord).then(response=>{
            this.record = response.data.data;
            this.$emit("updateRecord");
            this.dateShow = false;
        }).catch(err=>{
            console.log(err);
            this.dateShow = false;
        })
     
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

.movie-card {
  width: 90%;
}
.movie-status {
  background: #fafafa;
  padding: 30rpx;
  width: 10%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  color: orange;
  font-size: 25rpx;
  /* border-left: 2rpx dashed #e5e5e5; */
}
.movie {
    display: flex;
}
.passed {
    color: #e5e5e5;
}
</style>
