export const getAssetsFile = (url: string) => {
	return new URL(`../assets/img/${url}`, import.meta.url).href
}

export const isType = function (type, value) {
	return Object.prototype.toString.call(value) === `[object ${type}]`
}

/**
 * 判断是否为对象
 */
export const isObject = function (value) {
	return isType("Object", value)
}
