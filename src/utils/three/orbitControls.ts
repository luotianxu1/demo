import type { WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import type { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer"

/**
 * 创建一个轨道控制器
 * @param camera 将要被控制的相机
 * @param renderer WebGlRenderer
 * @returns OrbitControls
 */
export default function Controls(
	camera: THREE.Camera,
	renderer: WebGLRenderer | CSS3DRenderer | undefined
): OrbitControls | undefined {
	if (!renderer) {
		return
	}
	const controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true
	controls.update()
	return controls
}
