import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

/**
 * 创建一个轨道控制器
 * @param camera 将要被控制的相机
 * @param renderer WebGlRenderer
 * @returns OrbitControls
 */
export default function Controls(camera: THREE.Camera, renderer: THREE.WebGLRenderer): OrbitControls {
	const controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true
	controls.update()
	return controls
}
