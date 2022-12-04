<template>
	<view class="main">
		<view v-if="downDoneFile.length === 0 && downFileLen === 0" class="empty">
			<view>
				<u-icon name="/static/nodata.png" size="300rpx" />
				<view class="empty-btn">空空如也</view>
			</view>
		</view>
		<view class="undone" v-if="downFileLen !== 0">
			<uni-section title="未完成" type="line"></uni-section>
			<view v-for="item in downFile" :key="item.id" class="item">
				<view class="content">
					<!-- <image :src="item.thumbs.small"></image> -->
					<lazyImage width="120px" height="80px" borderRadius="16rpx" :src="item.thumbs.small"></lazyImage>
					<view class="info">
						<view class="resolution">{{item.resolution}}</view>
						<view class="progress">
							<u-line-progress :percentage="item.progress" activeColor="#4e6ef2" :showText="false" />
						</view>
						<view class="size">{{item | sizeFormat}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="done" v-if="downDoneFile.length !== 0">
			<uni-section title="已完成" :subTitle="`总数: ${downDoneFile.length}`" type="line">
				<template v-slot:right>
					<u-icon name='/static/icon/delete.png' :size="38" @click="DEL_ALL_DOWN_DONE_FILE"></u-icon>
				</template>
			</uni-section>
			<view v-for="(item,index) of downDoneFile" :key="item.id" class="item">
				<!-- <image :src="item.thumbs.small" @click="() => handleClickImg({item,index})"></image> -->
				<lazyImage width="120px" height="80px" borderRadius="16rpx" :src="item.thumbs.small"
					@click="() => handleClickImg({item,index})"></lazyImage>
				<view class="content">
					<view class="date">{{item.downTime}}</view>
					<view class="resolution">{{item.resolution}}</view>
					<view class="size">{{item.size}}</view>
				</view>
				<view class="del" @click="() => DEL_DOWN_DONE_FILE(item.path)">
					<u-icon name="close" color="#2979ff" size="44"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js'; //需要引入store
	import lazyImage from "@/components/lazy-image/index.vue"
	import {
		byte
	} from "@/util/util.js"
	export default {
		data() {
			return {
				downFile: {},
				downDoneFile: [],
				isClick: false,
				downFileLen: 0, // 记录正在下载的长度
			}
		},
		components: {
			lazyImage
		},
		onLoad() {
			this.downDoneFile = store.state.$downDoneFile
		},
		mounted() {
			uni.$on("down-file", (data) => {
				if (!Reflect.has(this.downFile, data.id)) {
					this.downFileLen += 1
				}
				// 这样写解决vue2监听不到对象的变化,导致无法更新视图
				this.$set(this.downFile, data.id, data)
			})
			uni.$on("del-down-file", (id) => {
				this.$delete(this.downFile, id)
				this.downFileLen -= 1
			})
		},
		beforeDestroy() {
			uni.$off('down-file');
			uni.$off('del-down-file');
		},
		filters: {
			sizeFormat(item) {
				return byte(item.offset) + "  /  " + byte(item.file_size)
			}
		},
		methods: {
			handleClickImg({
				index
			}) { // 点击后重定向
				if (!this.isClick) {
					// 保存一次就可以了
					store.commit("SET_IMGLIST", this.downDoneFile)
				}
				store.commit("SET_INDEX", index)
				uni.navigateTo({
					url: "/pages/detail/index"
				})

			},
			DEL_DOWN_DONE_FILE(name) {
				store.commit("DEL_DOWN_DONE_FILE", name)
			},
			DEL_ALL_DOWN_DONE_FILE() {
				this.downDoneFile = []
				store.commit("DEL_ALL_DOWN_DONE_FILE")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.undone {
		.item {
			display: flex;
			flex-direction: column;
			margin-bottom: 32rpx;
			overflow: hidden;
			position: relative;

			.content {
				display: flex;

				image {
					border-radius: 16rpx;
				}

				.info {
					padding-left: 32rpx;
					display: flex;
					justify-content: space-between;
					flex-direction: column;
					width: calc(100% - 120px);

					.progress {}
				}
			}
		}

	}

	/* image {
		width: 120px;
		height: 80px;
		border-radius: 16rpx;
	} */

	.title {
		color: #a7a7a7;
		margin: 10px;
		font-size: 36rpx;
		font-weight: bold;
	}

	.main {
		padding: 15rpx;
		margin-bottom: 350rpx;

		.empty {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;

			.empty-btn {
				color: white;
				margin: 10px;
				padding: 16rpx;
				border-radius: 24px;
				font-size: 36rpx;
				font-weight: bold;
				text-align: center;
				background-image: linear-gradient(135deg, #f6d365, #fda085);
			}
		}

		.done {
			display: flex;
			flex-direction: column;

			.item {
				display: flex;
				align-items: center;
				border-radius: 16rpx;
				margin-bottom: 32rpx;
				overflow: hidden;
				position: relative;

				.content {
					margin-left: 32rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;

					view {
						padding: 5rpx
					}
				}
			}

			.del {
				padding: 16rpx;
				position: absolute;
				right: 16rpx;
			}
		}
	}
</style>
