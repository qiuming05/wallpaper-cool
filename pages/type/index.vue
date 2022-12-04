<template>
	<view>
		<headBar></headBar>
		<view class="main">
			<scroll-view scroll-x="true">
				<view class="ranking">
					<view class="tab" hover-class="cate-active" hover-stay-time="50" @click="() => typeClick('最新榜',1)">
						<view>最新榜</view>
					</view>
					<view class="tab" hover-class="cate-active" hover-stay-time="50" @click="() => typeClick('最热榜',2)">
						<view>最热榜</view>
					</view>
					<view class="tab" hover-class="cate-active" hover-stay-time="50" @click="() => typeClick('排行榜',3)">
						<view>排行榜</view>
					</view>
					<view class="tab" hover-class="cate-active" hover-stay-time="50" @click="() => typeClick('收藏榜',4)">
						<view>收藏榜</view>
					</view>
					<view class="tab" hover-class="cate-active" hover-stay-time="50" @click="() => typeClick('随机榜',5)">
						<view>随机榜</view>
					</view>
				</view>
			</scroll-view>
			<view class="type">
				<view class="title">标签</view>
				<view class="categories">
					<scroll-view scroll-x="true" class="tab">
						<view class="tabs" v-for="(item,index) of Type" :key="index" @click="() => tabClick(item)"
							:class="item.E === currentType ? 'active' : ''">
							{{item.C}}
						</view>
					</scroll-view>
					<view class="item">
						<view class="items" v-for="item of currentAbout" :key="item.id" @click="()=> tagClick(item)">
							<uni-section class="mb-10" :title="item.C" type="line">
								<template v-slot:right>
									<u-icon name="arrow-right" color="#909399" size="28"></u-icon>
								</template>
							</uni-section>
						</view>
					</view>
				</view>
			</view>
		</view>
		<food-tab :index="1" @switchTab="switchTab"></food-tab>
	</view>
</template>

<script>
	import headBar from "@/components/head/head.vue"
	import foodTab from '@/components/foodTab/foodTab.vue'
	import categoriesType from "@/util/categories"
	const Type = [{
			C: "动漫与漫画",
			E: "Anime & Manga"
		},
		{
			C: "艺术与设计",
			E: "Art & Design"
		},
		{
			C: "娱乐",
			E: "Entertainment"
		},
		{
			C: "知识",
			E: "Knowledge"
		},
		{
			C: "地理位置",
			E: "Location"
		},
		{
			C: "杂项",
			E: "Miscellaneous"
		}, {
			C: "自然",
			E: "Nature"
		},
		{
			C: "人物",
			E: "People"
		},
		{
			C: "车辆",
			E: "Vehicles"
		}
	]


	export default {
		components: {
			foodTab,
			headBar
		},
		data() {
			return {
				categoriesType: categoriesType,
				Type: Type,
				currentType: "Anime & Manga",
				currentAbout: []
			}
		},
		async onLoad() {
			uni.hideTabBar()
			this.currentAbout = this.categoriesType.filter((item) => {
				return item.type === this.currentType
			})
		},
		methods: {
			tagClick(item, title) {
				uni.navigateTo({
					url: '/pages/preview/index?id=' + item.id + '&title=' + item.C,
				})
			},
			typeClick(type, id) {
				uni.navigateTo({
					url: '/pages/preview/index?type=' + id + '&title=' + type,
				})
			},
			tabClick(item) {
				this.currentType = item.E
				this.currentAbout = this.categoriesType.filter((_item) => {
					return _item.type === item.E
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./type.scss";
</style>
