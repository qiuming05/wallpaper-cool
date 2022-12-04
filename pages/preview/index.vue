<template>
	<view>
		<u-navbar :autoBack="true" :title="title" title-width="325" title-color="#333333" title-size="28"
			leftIconSize="38" :border-bottom="false" height="44px"></u-navbar>
		<view class="main" :style="{paddingTop: navbarHeight +'px'}">
			<imgList :data="data" :height="'calc(100vh - ' + navbarHeight  + 'px)'" :isload="isload" refresherEnabled
				:refresherTriggered="refresherTriggered" :scrollTop="scrollTop" @scroll="handleScroll"
				@scrolltolower="scrolltolower" @refresherrefresh="refresherrefresh">
				<template v-slot:top>
					<uni-section :title="`图片总数: ${meta.total}`" type="line"></uni-section>
				</template>
				<template v-if="data.length === 0" v-slot:bottom>
					<view class="empty">
						<view>
							<u-icon name="/static/nodata.png" size="300rpx" />
							<view class="empty-btn">空空如也</view>
						</view>
					</view>
				</template>
			</imgList>
		</view>
		<sidebar :isShowBackTop="isShowBackTop" @backTop="handleBackTop"></sidebar>
	</view>
</template>

<script>
	import store from '@/store/index.js'; //需要引入store
	import imgList from "@/components/img-list/index.vue"
	import sidebar from "@/components/sidebar/index.vue"
	import {
		objToUrl
	} from "@/util/util.js"
	const baseUrl = "https://wallhaven.cc/api/v1/"
	export default {
		data() {
			return {
				title: "", // 标题
				type: 0, // 类型
				id: 0, // id号
				data: [], // 图片数据
				page: 1, // 每页24张
				meta: {}, // 请求数据的详情
				mode: true, // 模式 false是排名榜 ture是标签
				isShowBackTop: false, // 是否显示返回顶部
				refresherTriggered: false, // 下拉状态
				isload: true, // 是否加载中
				navbarHeight: 44, //导航栏高度
				scrollTop: 0, // 控制滚动高度
				oldScrollTop: 0
			}
		},
		components: {
			imgList,
			sidebar
		},
		onLoad({
			title,
			type,
			id
		}) {
			this.title = title
			if (id) {
				this.id = id
				this.mode = true
				this.getIdData(id).then(res => {
					if (res.data) {
						this.meta = res.meta
						this.data = res.data
						if (this.data.length === 0) {
							this.isload = false
						}
					}
				})
			} else if (type) {
				this.type = parseInt(type)
				this.mode = false
				const _type = this.Adaptive(this.type)
				this.getTypeData(_type).then(res => {
					if (res.data) {
						this.meta = res.meta
						this.data = res.data
						if (this.data.length === 0) {
							this.isload = false
						}
					}
				})
			}
			uni.getSystemInfo({
				// 导航栏实际高度等于 = 44(导航栏的高度 )+ statusBarHeight(系统状态栏的高度)
				success: res => this.navbarHeight = res.statusBarHeight + 44
			});
		},
		watch: {
			data: function(newVal) {
				if (newVal.length % 24 !== 0) {
					this.isload = false
				}
				store.commit("SET_IMGLIST", newVal)
			}
		},
		methods: {
			handleScroll(e) {
				this.oldScrollTop = e.detail.scrollTop
				this.isShowBackTop = this.oldScrollTop > 200
			},
			handleBackTop() {
				this.scrollTop = this.oldScrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
			},
			refresherrefresh() {
				this.refresherTriggered = true
				this.page = 1
				this.tabTypeDataFill()
				this.getData().then(res => {
					this.meta = res.meta
					this.data = res.data
					this.refresherTriggered = false
					this.isload = true
				})
			},
			tabTypeDataFill() {
				this.data = new Array(12).fill({
					thumbs: {
						original: "/static/loading.gif"
					}
				})
			},
			Adaptive(type) {
				if (typeof type !== "number") return new Error("type is not Number")
				if (type === 1) {
					// 最新
					return "date_added"
				} else if (type === 2) {
					// 最热
					return "hot"
				} else if (type === 3) {
					// 排行
					return "toplist"
				} else if (type === 4) {
					// 收藏最多
					return "favorites"
				} else if (type === 5) {
					// 随机
					return "random"
				}
			},
			getTypeData(type, page = 1) {
				store.state.$screen.q = ""
				store.state.$screen.sorting = "type"
				return this.$request({
					url: baseUrl + `search?${objToUrl(store.state.$screen)}&page=${page}`
				})
			},
			getIdData(id, page = 1) {
				store.state.$screen.q = "id:" + id
				return this.$request({
					url: baseUrl + `search?${objToUrl(store.state.$screen)}&page=${page}`
				})
			},
			redirect(index) { // 点击后重定向
				store.commit("SET_INDEX", index)
				uni.navigateTo({
					url: "/pages/detail/index"
				})
			},
			getData() {
				if (this.mode) {
					return this.getIdData(this.id, this.page)
				} else {
					const type = this.Adaptive(parseInt(this.type))
					return this.getTypeData(type, this.page)
				}
			},
			scrolltolower() {
				if (this.isload) {
					this.page++
					this.getData().then(res => {
						if (res.data) {
							this.data = [...this.data, ...res.data]
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		padding: 0 15rpx 15rpx 15rpx;

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

		.loading {
			margin-top: 35rpx;
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

			.list-item {
				position: relative;
				border-radius: 8px;
				overflow: hidden;
				height: 240rpx;

				.list-item-bg {
					border-radius: 25rpx;
					width: 100%;
					height: 100%;
				}
			}

			.list-item:last-child {
				margin-bottom: 100rpx;
			}
		}
	}
</style>
