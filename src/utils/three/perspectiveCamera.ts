import * as THREE from "three"

/**
 * 创建一个透视相机
 * @param x
 * @param y
 * @param z
 * @param fov 摄像机视锥体垂直视野角度
 * @param name 摄像机名称
 * @param width 场景宽度
 * @param height 场景高度
 * @param near 摄像机视锥体长宽比
 * @param far 摄像机视锥体近端面
 * @returns PerspectiveCamera
 */
export default function PerspectiveCamera(
	x: number,
	y: number,
	z: number,
	fov: number,
	name: string | number,
	width: number,
	height: number,
	near: number = 0.1,
	far: number = 2000
): THREE.PerspectiveCamera {
	const camera = new THREE.PerspectiveCamera(fov, width / height, near, far)
	camera.position.set(x, y, z)
	camera.name = String(name)
	return camera
}
