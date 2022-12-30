<template>
	<view class="headbar" id="headbar">
		<view class="container" :style="{paddingTop: top + 'px'}">
			<view style="padding: 0 18rpx;">
				<u-icon name="/static/icon/flower.png" :size="66"></u-icon>
			</view>
			<u-search searchIconSize="38" placeholder="搜索你想要的壁纸" height="38px" disabled :showAction="false"
				@click="goSeach">
			</u-search>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				top: 44,
			}
		},
		created() {
			uni.getSystemInfo({
				success(e) {
					this.top = e.safeArea.top
				}
			})
		},
		methods: {
			goSeach() {
				uni.navigateTo({
					url: '/pages/search/index'
				})
			}
		},
		mounted() {
			let view = uni.createSelectorQuery().in(this).select(`#headbar`)
			view.fields({
				size: true
			}, data => {
				this.$emit("getHeight", data)
			}).exec()
		}
	}
</script>

<style lang="scss" scoped>
	.headbar {
		position: sticky;
		top: 0;
		width: 100%;
		background-color: #FFFFFF;
		padding: 0 12rpx 12rpx 12rpx;
		z-index: 101;
		box-shadow: 0 -3px 5px 0px #000;

		.container {
			display: flex;
			align-items: center;
			flex-direction: row;
			padding-right: 200rpx;
		}
	}
</style>
