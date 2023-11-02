import * as THREE from "three"

/**
 * 创建坐标格辅助对象
 * @param size 坐标格尺寸
 * @param divisions 坐标格细分次数
 * @param colorCenterLine 中线颜色
 * @param colorGrid 坐标格网格线颜色
 * @returns THREE.GridHelper
 */
export default function GridHelper(
	size: number = 50,
	divisions: number = 50,
	colorCenterLine: THREE.Color = new THREE.Color(0x444444),
	colorGrid: THREE.Color = new THREE.Color(0x888888)
): THREE.GridHelper {
	return new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid)
}
