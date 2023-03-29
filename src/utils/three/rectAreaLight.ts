import * as THREE from "three"

/**
 * 平面光
 * @param x
 * @param y
 * @param z
 * @param color 光照颜色
 * @param width 光源宽度
 * @param height 光源高度
 * @param intensity 光源强度
 * @returns RectAreaLight
 */
export default function RectAreaLight(
	x: number = 0,
	y: number = 300,
	z: number = 300,
	color: number | string = 0xffffff,
	width: number = 50,
	height: number = 50,
	intensity: number = 1
): THREE.RectAreaLight {
	const pointLight = new THREE.RectAreaLight(color, intensity, width, height)
	pointLight.position.set(x, y, z)
	return pointLight
}
