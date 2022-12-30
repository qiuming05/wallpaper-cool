// 获取时间
export const getTime = () => {
	const date = new Date();
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

// 字节转换
export const byte = (bytes) => {
	if (bytes === 0) return '0 B';
	var k = 1000, // or 1024
		sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
		i = Math.floor(Math.log(bytes) / Math.log(k));
	return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

// 将对象转换为参数
export const objToUrl = (obj = {}) => {
	let val = "";
	for (const key in obj) {
		if (key === "purity") {
			if (obj[key].length == 2) {
				// SFW Sketchy
				val += `&${key}=111`;
			} else if (obj[key][0] === 'SFW') {
				// SFW
				val += `&${key}=100`;
			} else {
				// Sketchy
				val += `&${key}=010`;
			}
		} else if (obj[key] !== "") {
			val += `&${key}=${obj[key]}`;
		}
	}
	return val
}
