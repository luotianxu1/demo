import * as THREE from "three"

/**
 * 半球光
 * @param skyColor 空中发出光线的颜色
 * @param groundColor 地面发出光线的颜色
 * @param intensity 光照强度
 * @returns HemisphereLight
 */
export default function HemisphereLight(
	skyColor: number | string = 0x0000ff,
	groundColor: number | string = 0x00ff00,
	intensity = 1
): THREE.HemisphereLight {
	const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity)
	return hemisphereLight
}
