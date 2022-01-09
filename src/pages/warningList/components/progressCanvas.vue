<template>
  <div class="progress">
    <canvas
      ref='canvasRef'
      class='canvas-con'
      :width='width'
      :height='height'
    />
    <div class='text'>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'progressCanvas',
  props:{
    total: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 150
    },
    lineWidth: {
      type: Number,
      default: 0
    }
  },
  data(){
    return {
      position: {
        x: 0,
        y: 0
      },
      canvas: null,
      ctx: null
    }
  },
  computed: {
    rate() {
      if (this.total !== 0 && this.step !== 0) {
        return this.step / this.total
      }
      return 0.006
    }
  },
  watch: {
    rate() {
      this.reset()
    }
  },
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes canvas画弧
  mounted(){
    this.$nextTick(() => {
      const canvas = this.$refs.canvasRef
      this.canvas = canvas
      if (canvas.getContext) {
        this.ctx = canvas.getContext('2d')
        const lineWidth = this.lineWidth || this.width * 0.07;
        const height = canvas.height - lineWidth / 2;
        this.position.x = canvas.width / 2
        this.position.y = height
        this.reset()
      }
    })
  },
  methods: {
    reset(){
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.draw({
        color: '#F6D49B',
        startAngle: Math.PI,
        endAngle: Math.PI * 2
      });

      const grd = ctx.createLinearGradient(0, 0, this.canvas.width * this.rate, 0);
      grd.addColorStop(0, '#6E94FF');

      this.draw({
        color: grd,
        startAngle: Math.PI,
        endAngle: Math.PI * (1 + this.rate)
      });
    },
    draw({color, startAngle, endAngle}){
      const lineWidth = this.lineWidth || this.width * 0.07 // 弧度宽度
      const radius = this.height - lineWidth
      const ctx = this.ctx;
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.arc(
        this.position.x, // x 坐标值
        this.position.y, // y 坐标值
        radius, // 圆弧半径
        startAngle, // 开始点
        endAngle // 结束点
      );
      ctx.stroke();
      ctx.closePath();
    }
  }
}
</script>

<style lang="less" scoped>
.progress {
  position: relative;
}
.canvas-con {
  display: block;
  margin: 0 auto;
}
.text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>