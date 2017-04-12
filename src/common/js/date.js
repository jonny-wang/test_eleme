// export default导出去直接import就行不用加{}
// export let/const/function可以有多个export，import {a, b}
export function formatDate(date, fmt) {
	// 截2、4
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	}
	for (let k in o) {
		// 构造正则写
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + ''
			// 1-9 01-09
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
		}
	}
	return fmt
}

// 补0
function padLeftZero(str) {
	return ('00' + str).substr(str.length)
}
