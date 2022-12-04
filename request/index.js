const timeout = 10 * 1000; //超时时间

const baseUrl = "https://wallhaven.cc/api/v1/search"

/**
 * 显示提示
 * @param {Object} message
 */
function showToast(message) {
	uni.showToast({
		title: message,
		duration: 1500,
		icon: 'none',
	});
}

export default function request(option) {
	let {
		url, // 满足其他需求
		data, // 请求数据
		method, // 请求方式
		header, // 请求头
		dataType, // 响应数据类型
		timeout = timeout, // 超时时间
		Loading = false // 是否有加载提示
	} = option || {};
	return new Promise((resolve, reject) => {
		try {
			if (!!Loading) {
				uni.showLoading({
					title: 'loading...'
				});
			}

			uni.request({
				url: url || baseUrl,
				method: method || "GET",
				data: data,
				header: header,
				dataType: dataType || "json",
				timeout: timeout,
				success: (res) => {
					showToast(res)
					if (res.data) {
						resolve(res.data);
					} else {
						reject(res);
					}
				},
				fail: (e) => {
					console.error("接口请求错误");
				},
				complete: () => {
					if (Loading !== false) {
						uni.hideLoading();
					}
				}
			});
		} catch (e) {
			console.error("方法异常：", e);
			reject({
				message: "请求错误",
			});
			showToast("请求错误");
		}
	});
}
