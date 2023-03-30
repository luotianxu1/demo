import * as THREE from "three"
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer"
import WebGl from "@utils/three/webGl"

export default class SmartFactory extends WebGl {
	floor1Group: THREE.Object3D<THREE.Event> | THREE.Group | undefined
	floor2Group: THREE.Object3D<THREE.Event> | THREE.Group | undefined
	wallGroup: THREE.Group | undefined

	constructor(domElement: HTMLDivElement, controls: boolean = true, css3dRednerer: boolean = false) {
		super(domElement, controls, css3dRednerer)

		this.activeCamera.position.set(300, 200, 500)
		this.addDirectionalLight(10, 100, 10, 0xffffff)
		this.webGlRender.toneMapping = THREE.ACESFilmicToneMapping
		this.webGlRender.toneMappingExposure = 0.8
		this.setBgHdr("./textures/hdr/2k.hdr")

		this.addGltf("./model/glb/wall.glb").then(gltf => {
			this.wallGroup = gltf.scene
			this.scene.add(gltf.scene)
		})

		this.addGltf("./model/glb/floor1.glb").then(gltf => {
			this.floor1Group = gltf.scene
			gltf.scene.traverse(child => {
				if (child instanceof THREE.Mesh) {
					child.material.emissiveIntensity = 5
				}
			})
			this.floor1Group.visible = false
			this.scene.add(this.floor1Group)
		})

		this.addGltf("./model/glb/floor2.glb").then(gltf => {
			this.floor2Group = gltf.scene
			gltf.scene.traverse(child => {
				if (child instanceof THREE.Mesh) {
					child.material.emissiveIntensity = 10
				}
				if (child.type === "Object3D" && child.children.length === 0) {
					const css3dObject = this.createTag(child)
					css3dObject.visible = false
					// this.floor2Tags.push(css3dObject)
					this.floor2Group?.add(css3dObject)
				}
			})
			this.floor2Group.visible = false
			this.scene.add(this.floor2Group)
		})
	}

	/**
	 * 创建标签
	 * @param object3d
	 * @returns
	 */
	createTag(object3d: THREE.Object3D) {
		// 创建各个区域的元素
		const element = document.createElement("div")
		element.className = "elementTag"
		element.innerHTML = `
          <div class="elementContent">
            <h3>${object3d.name}</h3>
            <p>温度:26℃</p>
            <p>湿度:50%</p>
          </div>
        `
		const objectCSS3D = new CSS3DObject(element)
		objectCSS3D.position.copy(object3d.position)
		objectCSS3D.scale.set(0.2, 0.2, 0.2)
		return objectCSS3D
	}
}
