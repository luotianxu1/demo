import * as THREE from "three"

/**
 * 点光源
 * @param x
 * @param y
 * @param z
 * @param color 颜色
 * @param intensity 光照强度
 * @param distance 光源照射的最大距离
 * @param decay 沿着光照距离的衰退量
 * @returns PointLight
 */
export default function PointLight(
	x: number = 0,
	y: number = 300,
	z: number = 300,
	color: number | string = 0xffffff,
	intensity: number = 1,
	distance: number = 0,
	decay: number = 2
): THREE.PointLight {
	const pointLight = new THREE.PointLight(color, intensity, distance, decay)
	pointLight.position.set(x, y, z)
	return pointLight
}
