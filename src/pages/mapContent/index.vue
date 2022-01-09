<template>
  <div class="map-content">
    <baidu-map
      class="bm-view"
      :center="center"   
      :zoom="zoom"
      @ready="handler"  
      :scroll-wheel-zoom="true" 
      :mapClick="false"
      :keyboard="false"
    >
      <!-- 比例尺控件，注册此组件才会在地图上显示比例尺 -->
      <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
      <!-- 缩放控件，注册此组件才会显示拖放进度 -->
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" type="BMAP_NAVIGATION_CONTROL_SMALL"></bm-navigation>
      <!-- 播放控制器 -->
      <bm-control v-if="ready && showPlayFunction" :offset="playControlSize">
        <div class="play-control" v-if="markers.length >= 2">
          <span class="play-icon" v-if="showPolyline" @click="playAnimation">
            <span class="icon"></span>
          </span>
          <span class="stop-icon" v-if="!showPolyline" @click="stopAnimation">
            <span class="icon"></span>
          </span>
        </div>
      </bm-control>

      <!-- 所有线路 -->
      <new-polyline
        v-if="markers && markers.length >= 2 && checkPoints({ points: markers }) && showPolyline && showPlayFunction"
        :path="markers" 
        :icons="polylineIcons"
        stroke-color="blue" 
        :stroke-opacity="0.5" 
        :stroke-weight="8" 
        :massClear="false"
        :editing="false"
        :clicking="false"
        >
      </new-polyline>
      <!-- 运动线路 -->
      <new-polyline
        v-if="playMarkers && playMarkers.length >= 2 && checkPoints({ points: playMarkers }) && !showPolyline && showPlayFunction"
        :path="playMarkers" 
        :icons="playPolylineIcons"
        stroke-color="red" 
        :stroke-opacity="0.5" 
        :stroke-weight="8" 
        :editing="false"
        :clicking="false"
        >
      </new-polyline>

      <div v-for="(marker, index) in markers" :key="marker.id + index">
        <!-- 标记点组件 -->
        <bm-marker
          :icon="marker.isChecked ? iconCheck : icon"
          :position="{ lng: marker.lng, lat: marker.lat }"
          :massClear="false"
          @click="infoWindowOpen(marker, index)"
        >
          <!-- 标签组件 -->
          <bm-label
            v-if="marker.showFlag"
            :massClear="false"
            :content='`${marker.address}（${marker.name}）`'
            :labelStyle="labelStyle"
            :offset="{ width: 10, height: -43 }"
          >
          </bm-label>
        </bm-marker>
      </div>

    </baidu-map>

  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'; // 局部注册
import BmScale from 'vue-baidu-map/components/controls/Scale.vue';
import BmNavigation from 'vue-baidu-map/components/controls/Navigation.vue';
import BmControl from 'vue-baidu-map/components/controls/Control.vue';
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue';
import BmLabel from 'vue-baidu-map/components/overlays/Label.vue';
import NewPolyline from './new_polyline.vue'
const label_icon = require('../../assets/svg/label.svg')
export default {
  components:{
    BaiduMap, BmScale, BmNavigation, BmControl, BmMarker, BmLabel,
    NewPolyline
  },
  props: {
    // 地图标记点数据
    markers: {
      type: Array,
      default: () => []
    },
    zoom: {
      type: Number,
      default: 13
    },
    // 是否展示路线与播放路线
    showPlayFunction: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      BMap: null,
      map: null,
      ready: false,
      mapSize: {
        width: 0,
        height: 0
      },
      playControlSize: {},
      center: { lng: null, lat: null },
      // markers: [
      //   {
      //     id: "244436011264770048",
      //     lng:115.435906,
      //     lat:22.816529,
      //     address: "欧桥警务查报站",
      //     name: "DW0029欧桥警务查报站",
      //     isChecked: false,
      //     showFlag: false,
      //   },
      //   {
      //     id: "244436011264770049",
      //     lng:115.426053,
      //     lat:22.795034,
      //     address: "zhanqianlu",
      //     name: "zhanqianlu",
      //     isChecked: false,
      //     showFlag: false,
      //   }
      // ],
      polylineIcons: [],
      icon: {
        url: require('../../assets/svg/point_icon.svg'),
        size: {width: 22, height: 32},
        opts: {anchor: {width: 11, height: 16}}
      },
      iconCheck: {
        url: require('../../assets/svg/point_icon_active.svg'),
        size: {width: 42, height: 50},
        opts: {anchor: {width: 21, height:16}}
      },
      showPolyline: true,
      playMarkers: [],
      playPolylineIcons: [],
      playSetInterval: null,

      labelStyle: {
        padding: '9px 7px',
        color: '#ffffff',
        lineHeight: '18px',
        fontFamily: 'PingFangSC, PingFangSC-Regular',
        fontSize: '12px',
        background: `url(${label_icon}) 10px center/16px no-repeat,linear-gradient(270deg,#44b7fe, #0f5afe)`,
        borderRadius: '4px',
        paddingLeft: '28px',
        border: 'none',
      }
    }
  },
  computed:{
  },
  beforeDestroy(){
    this.playSetInterval && clearInterval(this.playSetInterval)
  },
  watch:{
    mapSize(val){
      this.playControlSize = {
        width: val.width / 2 - 30,
        height: val.height - 70,
      }
      this.ready = true
    }
  },
  mounted(){
    console.log(this.markers, 'markers')
  },
  methods: {
    // 地图初始化完成回调
    handler({ BMap, map }) {

       // 自动获取展示的比例
      // var view = map.getViewport(eval(this.markers))
      // this.zoom = view.zoom;
      // this.center = view.center;
      // console.log(view, 11)

      map.enableDragging(true)
      // todo 
      if (this.markers.length) {
        map.setCenter(new BMap.Point(this.markers[0].lng, this.markers[0].lat))
      } else {
        map.setCenter(new BMap.Point(115.43643, 22.7957))
      }

      this.BMap = BMap
      this.map = map
      if (this.showPlayFunction) {
        this.addPolylineArrow()
        const mapSize = map.getSize()
        this.mapSize = mapSize
      }

      // 解决百度地图js在移动端点击无效
      //触摸事件(解决点击事件无效)--触摸开始，开启拖拽
      map.addEventListener('touchmove', function() {
        map.enableDragging();
      });
      //触摸结束始，禁止拖拽
      map.addEventListener("touchend", function() {
        map.disableDragging();
      });
    },
    addPolylineArrow(){
      const BMap = this.BMap
      const sy = new BMap.Symbol(window.BMap_Symbol_SHAPE_FORWARD_OPEN_ARROW, {
        scale: 0.6, // 图标缩放大小
        strokeOpacity: 0.7,
        strokeColor: "blue", // 设置矢量图标的线填充颜色
        strokeWeight: "2" // 设置线宽
      });
      const icons = new BMap.IconSequence(sy, "20", "35");
      this.polylineIcons.push(icons)
    },
    clearPolylineArrow(){
      this.map.clearOverlays()
    },

     // 查重 如果数组中只有一组有意义的坐标,绘制折线时可能会报错,因为绘制一条折线需要两组不同的坐标点
    checkPoints({ points }) {
      // 拿到第一组点
      const originPoint = points[0];
      // 将第一组点与后续点进行对比 如果坐标集合中只有一组实际坐标点则return false
      // 只要坐标集合中有两组不同的实际坐标点,则return true
      for (let i = 1; i < points.length; i++) {
        if (
          points[i].lat !== originPoint.lat ||
          points[i].lng !== originPoint.lng
        ) {
          return true;
        }
      }
      return false;
    },

    // 打开标记详情
    infoWindowOpen(marker) {
      marker.timer && clearTimeout(marker.timer)
      marker.showFlag = true
      marker.timer = setTimeout(() => {
        marker.showFlag = false
      }, 3000)
      console.log(marker.showFlag)
      // 详情时不需要展示是否选中
      if (this.showPlayFunction) {
        return
      }
      marker.isChecked = !marker.isChecked
      this.$emit('clickMarker', marker)
    },

    getPointItem(xoy1, xoy2, num, m) {
      return (xoy2 - xoy1) / num * m + xoy1
    },
    getPoints(_startPoint, _endPoint){
      const num = 50;
      let points = [];
      for (let i = 0; i < num + 1; i++){
        const lng = this.getPointItem(_startPoint.lng, _endPoint.lng, num, i);
        const lat = this.getPointItem(_startPoint.lat, _endPoint.lat, num, i);
        points.push({lng: Number(lng.toFixed(7)), lat: Number(lat.toFixed(7))});
      }
      return points
    },
    getAllSplitPoints(){
      const allPixel = []
      this.markers.forEach((marker, index) => {
        const end = this.markers[index + 1]
        if (!end) {
          return
        }
        const pixels = this.getPoints(marker, end)
        allPixel.push(...pixels)
      })
      return allPixel
    },
    start(){
      this.playSetInterval && clearInterval(this.playSetInterval)
      this.playMarkers = []
      const allPixel = this.getAllSplitPoints() // 获取所有markers之间的分割点
      let count = 0
      let newArr = []
      this.playSetInterval = setInterval(() => {
        if (count === allPixel.length) {
          // clearInterval(this.playSetInterval)
          this.stopAnimation()
          return
        }
        newArr.push(allPixel[count])
        this.playMarkers = newArr
        const lng = allPixel[count].lng
        const lat = allPixel[count].lat
        this.map.setCenter(new this.BMap.Point(lng, lat))
        count++
        this.addPlayArrow(count)
      }, 10)
    },
    addPlayArrow(current){
      if (current === 0 ||current%25 !== 0) {
        return
      }
      const BMap = this.BMap
      const sy = new BMap.Symbol(window.BMap_Symbol_SHAPE_FORWARD_OPEN_ARROW, {
        scale: 0.6, // 图标缩放大小
        strokeOpacity: 0.7,
        strokeColor: "red", // 设置矢量图标的线填充颜色
        strokeWeight: "2" // 设置线宽
      });
      const icons = new BMap.IconSequence(sy, "20", "35");
      this.playPolylineIcons.push(icons)
    },
    
    async playAnimation(){
      this.playPolylineIcons = []
      await this.clearPolylineArrow()
      this.showPolyline = false
      this.start()
    },
    async stopAnimation(){
      // this.map.setCenter(new this.BMap.Point(115.762994, 22.945501))
      // todo
      if (this.markers.length) {
        this.map.setCenter(new this.BMap.Point(this.markers[0].lng, this.markers[0].lat))
      } else {
        this.map.setCenter(new this.BMap.Point(115.43643, 22.7957))
      }
      this.playSetInterval && clearInterval(this.playSetInterval)
      await this.clearPolylineArrow()
      this.showPolyline = true
      this.addPolylineArrow()
    },
  }
}
</script>

<style lang="less" scoped>
.bm-view {
  width: 100%;
  height: 600px;
}
.play-icon, .stop-icon {
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  .icon {
    display: inline-block;
    margin: 20px 0 0 20px;
    border-radius: 2px;
  }
}
.play-icon {
  background: linear-gradient(180deg,#23b1fd, #002eff);
  .icon {
    margin-left: 23px;
    border-left: 20px solid #fff;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }
}
.stop-icon {
  background: linear-gradient(180deg,#f8cb43, #dfa11d);
  .icon {
    width: 20px;
    height: 20px;
    background: #fff;
  }
}
</style>