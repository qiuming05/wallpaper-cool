<template>
	<view @touchstart="touchStart" @touchend="touchEnd">
		<slot></slot>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				touchStartX: 0, // 触屏起始点x  
				touchStartY: 0, // 触屏起始点y  
				direction: null, // 滑动方向
			}
		},
		methods: {
			touchStart(e) {
				this.touchStartX = e.touches[0].clientX;
				this.touchStartY = e.touches[0].clientY;
			},
			touchEnd(e) {
				let deltaX = e.changedTouches[0].clientX - this.touchStartX;
				let deltaY = e.changedTouches[0].clientY - this.touchStartY;

				if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
					if (deltaX >= 0) {
						this.direction = 'left'
					} else {
						this.direction = 'right'
					}
				} else if (Math.abs(deltaY) > 50 && Math.abs(deltaX) < Math.abs(deltaY)) {
					if (deltaY < 0) {
						this.direction = 'up'
					} else {
						this.direction = 'down'
					}
				}
				this.$emit("positionData", {
					direction: this.direction,
					x: deltaX,
					y: deltaY
				})
			},
		}
	}
</script>
