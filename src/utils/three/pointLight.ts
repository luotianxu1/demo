import * as THREE from "three"

/**
 * 点光源
 * @param x
 * @param y
 * @param z
 * @param color 颜色
 * @param intensity 光照强度
 * @returns PointLight
 */
export default function PointLight(
	x: number = 0,
	y: number = 300,
	z: number = 300,
	color: number | string = 0xffffff,
	intensity: number = 1
): THREE.PointLight {
	const pointLight = new THREE.PointLight(color, intensity)
	pointLight.position.set(x, y, z)
	return pointLight
}
