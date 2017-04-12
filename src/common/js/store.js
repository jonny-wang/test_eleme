export function saveToLocal(id, key, value) {
	// __seller__私有
	let seller = window.localStorage.__seller__
	if (!seller) {
		seller = {}
		seller[id] = {}
	} else {
		// localStore存的是字符串
		seller = JSON.parse(seller)
		if (!seller[id]) {
			seller[id] = {}
		}
	}
	// 都要存进去
	seller[id][key] = value
	window.localStorage.__seller__ = JSON.stringify(seller)
}

export function loadFromLocal(id, key, def) {
	// def是默认
	let seller = window.localStorage.__seller__
	if (!seller) {
		return def
	}
	seller = JSON.parse(seller)[id]
	if (!seller) {
		return def
	}
	let ret = seller[key]
	return ret || def
}
