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

/**
 * 生成规定范围内随机数
 * @param min 最小值
 * @param max 最大值
 * @returns number
 */
export const random = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}
