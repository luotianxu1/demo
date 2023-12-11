export function getAssetsFile(url: string) {
	return new URL(`../assets/img/${url}`, import.meta.url).href
}

export function isType(type, value) {
	return Object.prototype.toString.call(value) === `[object ${type}]`
}

/**
 * 判断是否为对象
 */
export function isObject(value) {
	return isType("Object", value)
}

/**
 * 生成规定范围内随机数
 * @param min 最小值
 * @param max 最大值
 * @returns number
 */
export function random(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 首字母大写
 * @param str 字符串
 * @returns
 */
export function upperCase(str: string) {
	return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
}
