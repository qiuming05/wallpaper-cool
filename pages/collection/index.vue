<template>
	<view class="main">
		<view v-if="data.length === 0" class="empty">
			<view>
				<u-icon name="/static/nodata.png" size="300rpx" />
				<view class="empty-btn">空空如也</view>
			</view>
		</view>
		<view v-else>
			<imgList :data="data" height='100vh' @click="handleClick" @scrolltolower="scrolltolower">
				<template v-slot:top>
					<uni-section title="我的收藏" :subTitle="`总数: ${dataLen}`" type="line">
						<template v-slot:right>
							<u-icon name='/static/icon/delete.png' :size="38" @click="deleteData"></u-icon>
						</template>
					</uni-section>
				</template>
			</imgList>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js'; //需要引入store
	import imgList from "@/components/img-list/index.vue"
	export default {
		data() {
			return {
				data: [], // 需要渲染的图片数据
				dataLen:0,
				page: 1, // 每页24张
				isClick: false // 是否点击过，在第一次点击时保存数据
			}
		},
		components: {
			imgList,
		},
		onLoad() {},
		onShow() {
			this.data = store.state.$collection.slice(0, this.page * 24)
			this.dataLen = store.state.$collection.length
		},
		methods: {
			scrolltolower() {
				if (Math.ceil(this.dataLen / 24) !== this.page) {
					this.page++
					this.data = store.state.$collection.slice(0, this.page * 24)
				}
			},
			deleteData() {
				this.data = []
				store.commit("DEL_ALL_COLLECTION")
			},
			handleClick({
				index
			}) { // 点击后重定向
				if (!this.isClick) {
					// 保存一次就可以了
					store.commit("SET_IMGLIST", this.data)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		padding: 0 15rpx 0 15rpx;

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

		.title {
			padding: 24rpx 0;
			font-size: 36rpx;
			font-weight: 700;
			text-align: right;
		}

		.previewList {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 15rpx;

			.list-item:last-child {
				margin-bottom: 100px;
			}

			.list-item {
				position: relative;
				border-radius: 8px;
				overflow: hidden;
				height: 240rpx;
				box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);

				.list-item-bg {
					border-radius: 25rpx;
					width: 100%;
					height: 100%;
				}
			}

			/* .list-item:last-child {
					margin-bottom: 350rpx;
				} */
		}
	}
</style>
