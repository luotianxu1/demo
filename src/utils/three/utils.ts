import * as THREE from "three"

/**
 * 经纬度坐标转球面坐标
 * @param R 地球半径
 * @param longitude 经度(角度值)
 * @param latitude 维度(角度值)
 */
export function lon2xyz(R, longitude, latitude) {
	let lon = (longitude * Math.PI) / 180 //转弧度值
	const lat = (latitude * Math.PI) / 180 //转弧度值
	lon = -lon // three.js坐标系z坐标轴对应经度-90度，而不是90度

	// 经纬度坐标转球面坐标计算公式
	const x = R * Math.cos(lat) * Math.cos(lon)
	const y = R * Math.sin(lat)
	const z = R * Math.cos(lat) * Math.sin(lon)
	// 返回球面坐标
	return new THREE.Vector3(x, y, z)
}
