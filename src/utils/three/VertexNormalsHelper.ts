import { VertexNormalsHelper } from "three/addons/helpers/VertexNormalsHelper"

/**
 * 箭头辅助对象
 * @param object 要渲染顶点法线辅助的对象
 * @param size 箭头的长度. 默认为 1
 * @param linewidth 箭头线段的宽度. 默认为 1
 * @param color 16进制颜色值. 默认为 0xff0000
 * @returns VertexNormalsHelper
 */
export default function VertexNormalsHelperCustom(
	object,
	size: number = 2,
	color: string | number = 0xff0000,
	linewidth: number = 1
) {
	return new VertexNormalsHelper(object, size, color, linewidth)
}
