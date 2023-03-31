import * as THREE from "three"
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer"
import gsap from "gsap"
import WebGl from "@utils/three/webGl"
import eventHub from "@utils/eventHub"

export default class SmartFactory extends WebGl {
	floor1Group: THREE.Group | undefined
	floor2Group: THREE.Group | undefined
	wallGroup: THREE.Group | undefined
	floor2Tags: CSS3DObject[] | undefined = []

	constructor(domElement: HTMLDivElement, controls: boolean = true, css3dRednerer: boolean = false) {
		super(domElement, controls, css3dRednerer)

		this.activeCamera.position.set(300, 200, 500)
		this.addDirectionalLight(10, 100, 10, 0xffffff)
		this.webGlRender.toneMapping = THREE.ACESFilmicToneMapping
		this.webGlRender.toneMappingExposure = 0.8
		this.setBgHdr("./textures/hdr/2k.hdr")

		// 添加外墙
		this.addGltf("./model/glb/wall.glb").then(gltf => {
			this.wallGroup = gltf.scene
			this.scene.add(gltf.scene)
		})

		// 添加第一层
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

		// 添加第二层
		this.addGltf("./model/glb/floor2.glb").then(gltf => {
			this.floor2Group = gltf.scene
			gltf.scene.traverse(child => {
				if (child instanceof THREE.Mesh) {
					child.material.emissiveIntensity = 10
				}
				if (child.type === "Object3D" && child.children.length === 0) {
					const css3dObject = this.createTag(child)
					css3dObject.visible = false
					this.floor2Tags?.push(css3dObject)
					this.floor2Group?.add(css3dObject)
				}
			})
			this.floor2Group.visible = false
			this.scene.add(this.floor2Group)
		})

		this.initEvent()
	}

	/**
	 * 创建标签
	 * @param Object3D
	 * @returns CSS3DObject
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

	showFloor1() {
		if (!this.floor1Group) return
		this.floor1Group.visible = true
	}

	hideFloor1() {
		if (!this.floor1Group) return
		this.floor1Group.visible = false
	}

	showFloor2() {
		if (!this.floor2Group) return
		this.floor2Group.visible = true
		this.floor2Tags?.forEach(tag => {
			tag.visible = true
		})
	}

	hideFloor2() {
		if (!this.floor2Group) return
		this.floor2Group.visible = false
		this.floor2Tags?.forEach(tag => {
			tag.visible = false
		})
	}

	showWall() {
		if (!this.wallGroup) return
		this.wallGroup.visible = true
	}

	hideWall() {
		if (!this.wallGroup) return
		this.wallGroup.visible = false
	}

	showAll() {
		this.showFloor1()
		this.showFloor2()
		this.showWall()
		if (!this.wallGroup || !this.floor2Group) return
		gsap.to(this.wallGroup?.position, {
			y: 200,
			duration: 1
		})
		gsap.to(this.floor2Group?.position, {
			y: 100,
			duration: 1,
			delay: 1
		})
	}

	hideAll() {
		if (!this.wallGroup || !this.floor2Group) return
		gsap.to(this.wallGroup?.position, {
			y: 0,
			duration: 1,
			delay: 1,
			onComplete: () => {
				this.hideFloor1()
				this.hideFloor2()
			}
		})
		gsap.to(this.floor2Group?.position, {
			y: 0,
			duration: 1
		})
	}

	initEvent() {
		eventHub.on("showFloor1", () => {
			this.showFloor1()
			this.hideWall()
			this.hideFloor2()
		})
		eventHub.on("showFloor2", () => {
			this.showFloor2()
			this.hideFloor1()
			this.hideWall()
		})
		eventHub.on("showWall", () => {
			this.showWall()
			this.hideFloor1()
			this.hideFloor2()
		})
		eventHub.on("showAll", () => {
			this.showAll()
		})
		eventHub.on("hideAll", () => {
			this.hideAll()
		})
	}
}
