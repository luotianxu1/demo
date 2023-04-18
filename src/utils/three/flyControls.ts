import type { WebGLRenderer } from "three"
import { FlyControls } from "three/examples/jsm/controls/FlyControls"
import type { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer"

/**
 * 创建飞行控制器
 * @param camera 将要被控制的相机
 * @param renderer WebGlRenderer
 * @returns FlyControls
 */
export default function FControls(
	camera: THREE.Camera,
	renderer: WebGLRenderer | CSS3DRenderer | undefined
): FlyControls | undefined {
	if (!renderer) {
		return
	}
	const controls = new FlyControls(camera, renderer.domElement)
	return controls
}
