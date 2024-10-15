/**
 * 获取系统
 */
const ua = navigator.userAgent.toLowerCase()
const testUa = regexp => regexp.test(ua)

function systemType() {
	let system
	if (testUa(/windows|win32|win64|wow32|wow64/gi)) {
		system = "windows"
	} else if (testUa(/macintosh|macintel/gi)) {
		system = "macos"
	} else if (testUa(/x11/gi)) {
		system = "linux"
	} else if (testUa(/android|adr/gi)) {
		system = "andriod"
	} else if (testUa(/ios|iphone|ipad|iwatch/gi)) {
		system = "ios"
	}
	return system
}

/**
 * 获取运行平台类型
 */
function systemPlatform() {
	let type
	const platform = systemType()
	if (platform === "windows" || platform === "macos" || platform === "linux") {
		type = "computer"
	} else {
		type = "phone"
	}
	return type
}

/**
 * 获取浏览器语言
 */
function getLanguage() {
	return navigator.language.toLowerCase()
}

export { systemType, systemPlatform, getLanguage }
