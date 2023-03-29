import * as THREE from "three"

/**
 * 平行光
 * @param x
 * @param y
 * @param z
 * @param color 颜色
 * @param intensity 光照强度
 * @param isCastShadow 是否产生阴影
 * @returns DirectionalLight
 */
export default function DirectionLight(
	x: number = 50,
	y: number = 1500,
	z: number = 50,
	color: number | string = 0xffffff,
	intensity: number = 1,
	isCastShadow: boolean = true
): THREE.DirectionalLight {
	const directionalLight = new THREE.DirectionalLight(color, intensity)
	directionalLight.position.set(x, y, z)
	directionalLight.castShadow = isCastShadow
	return directionalLight
}
