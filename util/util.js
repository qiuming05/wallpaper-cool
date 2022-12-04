export const getTime = () => {
	let date = new Date();
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}


/**
 * 存储单位换算
 * @param {*} bytes  
 */
export const byte = (bytes) => {
	if (bytes === 0) return '0 B';
	var k = 1000, // or 1024
		sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
		i = Math.floor(Math.log(bytes) / Math.log(k));

	return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}


/**
 * obj 转 url
 * @param {*} obj
 */
export const objToUrl = (obj = {}) => {
	let str = "";
	for (const key in obj) {
		if (key === "purity") {
			if (obj[key].length == 2) {
				// SFW Sketchy
				str += `&${key}=111`;
			} else if (obj[key][0] === 'SFW') {
				// SFW
				str += `&${key}=100`;
			} else {
				// Sketchy
				str += `&${key}=010`;
			}
		} else if (obj[key] !== "") {
			str += `&${key}=${obj[key]}`;
		}
	}
	return str
}
