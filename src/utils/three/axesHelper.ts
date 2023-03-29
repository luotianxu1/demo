import * as THREE from "three"

/**
 * 创建坐标轴辅助器
 * @param size 长度
 * @returns AxesHelper
 */
export default function AxesHelper(size: number = 50): THREE.AxesHelper {
	return new THREE.AxesHelper(size)
}
