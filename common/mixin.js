export default {
	data() {
		return {
			TabBarcurrent: 0
		}
	},
	methods: {
		switchTab(index) {
			this.TabBarcurrent = index
			if (this.TabBarcurrent === 0) {
				uni.switchTab({
					url: '/pages/index/index'
				})
			} else if (this.TabBarcurrent == 1) {
				uni.switchTab({
					url: '/pages/type/index'
				})
			} else if (this.TabBarcurrent == 2) {
				uni.switchTab({
					url: '/pages/user/index'
				})
			}
		}
	}
}
