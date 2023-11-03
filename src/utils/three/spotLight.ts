import * as THREE from "three"

/**
 * 聚光灯光源
 * @param x
 * @param y
 * @param z
 * @param color 颜色
 * @param intensity 强度
 * @param isCastShadow 阴影
 * @returns SpotLight
 */
export default function SpotLight(
	x: number = 100,
	y: number = 100,
	z: number = 100,
	color: number | string = 0xffffff,
	intensity: number = 1,
	penumbra: number = 0,
	decay: number = 2,
	isCastShadow: boolean = true
) {
	const spotLight = new THREE.SpotLight(color, intensity, penumbra, decay)
	spotLight.position.set(x, y, z)
	spotLight.castShadow = isCastShadow
	return spotLight
}
