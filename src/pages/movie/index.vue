<template>
  <div>
    <div class="search-section">
      <van-search
        :value="keyword"
        placeholder="请输入关键词"
        shape="round"
        @search="search"
        use-action-slot
      >
        <div slot="action" @click="show=!show">
          <van-icon name="filter-o"></van-icon>筛选
        </div>
      </van-search>

      <div class="filter-tags" v-if="currentGenre>0 || currentRegion>0 || currentYear>0">
        <div class="filter-tag">
          <van-tag type="success" round v-if="currentGenre>0">{{genres[currentGenre]}}</van-tag>
        </div>
        <div class="filter-tag">
          <van-tag type="success" round v-if="currentRegion>0">{{regions[currentRegion]}}</van-tag>
        </div>
        <div class="filter-tag">
          <van-tag type="success" round v-if="currentYear>0">{{years[currentYear]}}</van-tag>
        </div>
      </div>
    </div>

    <div class="movies">
      <div v-for="(movie,i) in movies" :key="i">       
        <movie :movie="movie" :records="records" :idx="i" @updateRecord="getRecords" />  
      </div>
    </div>
    <van-popup :show="show" position="bottom" @close="show=false">
      <div>
        <div class="button-group">
          <change-color-button
            v-for="(region, i) in regions"
            :key="i"
            :index="i"
            :current="currentRegion"
            :name="region"
            @updateCurrent="setCurrent('currentRegion', $event)"
          />
        </div>
        <div class="button-group">
          <change-color-button
            v-for="(genre, i) in genres"
            :key="i"
            :index="i"
            :current="currentGenre"
            :name="genre"
            @updateCurrent="setCurrent('currentGenre', $event)"
          />
        </div>
        <div class="button-group">
          <change-color-button
            v-for="(year, i) in years"
            :key="i"
            :index="i"
            :current="currentYear"
            :name="year"
            @updateCurrent="setCurrent('currentYear', $event)"
          />
        </div>
        <div class="button-group">
          <van-button
            icon="descending"
            size="small"
            :type="desc?'primary':'default'"
            round
            @click="desc=true"
          >降序</van-button>
          <van-button
            icon="ascending"
            size="small"
            :type="desc?'default':'primary'"
            round
            @click="desc=false"
          >升序</van-button>
        </div>
        <div class="button-control">
          <div class="left-button">
            <van-button icon="descending" type="primary" @click="show=false">确认</van-button>
          </div>
          <div class="right-button">
            <van-button
              icon="ascending"
              type="primary"
              @click="currentGenre=0;currentRegion=0;currentYear=0;show=false"
            >重置</van-button>
          </div>
        </div>
      </div>
    </van-popup>

    <mytabbar :active="active"></mytabbar>
  </div>
</template>
<script>
import mytabbar from "@/components/tabbar";
import Movie from "@/components/movie";
import MovieService from "@/api/movieservice";
import Constant from "@/utils/constant";
import ChangeColorButton from "@/components/changeColorButton";

export default {
  data() {
    return {
      records: {},
      currentRegion: 0,
      currentGenre: 0,
      currentYear: 0,
      desc: true,
      regions: ["全部地区"],
      genres: ["全部类型"],
      years: ["全部年份"],
      active: 1,
      show: false,
      keyword: "",
      movies: [],
      from: 0,
      size: 10
    };
  },
  onReachBottom() {
    this.from += this.size;
    this.getMovies(this.from, this.size);
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    let token = wx.getStorageSync(Constant.AUTHENTICATION);
    if (!token) {
      const url = "/pages/login/main";
      wx.navigateTo({ url });
    } else {
       this.getRecords();
      this.getMovies(this.from, this.size);
      this.getGenres();
      this.getRegions();
      this.getYears();
     
    }
  },
  methods: {
    getRecords() {
      this.records={};
      MovieService.getRecords().then(response=>{
        response.data.data.map(r=>this.records[r.movieId]=r);
      })
    },
   
    search(event) {
      this.keyword = event.mp.detail;
      this.movies = [];
      this.from = 0;
      this.getMovies(this.from, this.size);
    },
    getMovies(from, size) {
      const data = {
        sort: {
          field: "rating",
          order: this.desc ? "desc" : "asc"
        }
      };
      if (this.keyword) {
        Object.assign(data, {
          multiMatch: {
            keyword: this.keyword,
            fields: ["name", "cast", "director", "playwright"]
          }
        });
      }
      const filter = [];
      if (this.currentGenre > 0) {
        filter.push({
          field: "genres",
          operation: "term",
          opValue: this.genres[this.currentGenre]
        });
      }
      if (this.currentRegion > 0) {
        filter.push({
          field: "regions",
          operation: "term",
          opValue: this.regions[this.currentRegion]
        });
      }
      if (this.currentYear > 0) {
        filter.push({
          field: "year",
          operation: "term",
          opValue: this.years[this.currentYear]
        });
      }
      if (filter) {
        Object.assign(data, { filter: filter });
      }
      MovieService.list(from, size, data)
        .then(res => this.movies.push(...res.data.data))
        .catch(err => console.log(err));
    },
    setCurrent(member, event) {
      console.log(event);
      this[member] = event;
    },
    getGenres() {
      const data = {
        aggregation: {
          field: "genres",
          operation: "terms"
        }
      };
      MovieService.list(this.from, this.size, data)
        .then(res => this.genres.push(...res.data.data))
        .catch(err => console.log(err));
    },
    getRegions() {
      const data = {
        aggregation: {
          field: "regions",
          operation: "terms"
        }
      };
      MovieService.list(this.from, this.size, data)
        .then(res => this.regions.push(...res.data.data))
        .catch(err => console.log(err));
    },
    getYears() {
      const data = {
        aggregation: {
          field: "year",
          operation: "terms"
        }
      };
      MovieService.list(this.from, this.size, data)
        .then(res => this.years.push(...res.data.data))
        .catch(err => console.log(err));
    }
  },
  
  components: {
    mytabbar,
    Movie,
    ChangeColorButton
  }
};
</script>
<style>
.search-section {
  top: 0;
  position: fixed;
  width: 100%;
  z-index: 999;
}
.movies {
  margin-bottom: 100rpx;
  margin-top: 120rpx;
}
.button-group {
  display: flex;
  width: 100%;
  padding: 10rpx;
  flex-wrap: wrap;
  margin-bottom: 30rpx;
}
.button-control {
  display: flex;
  margin-top: 50rpx;
  width: 100%;
  justify-content: center;
}
.left-button {
  display: flex;
  width: 45%;
  justify-content: flex-start;
}
.right-button {
  width: 45%;
  display: flex;
  justify-content: flex-end;
}
.filter-tags {
  background: #f2f2f2;
  padding: 0 30rpx 15rpx;
  display: flex;
}
.filter-tag {
  margin-right: 20rpx;
}

</style>