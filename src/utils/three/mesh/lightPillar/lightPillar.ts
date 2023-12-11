import * as THREE from "three"
import gsap from "gsap"
import { random } from "@/utils/tools"

export interface ILightPillar {
	point: {
		x: number
		y: number
		z: number
	}
	lightColumn?: {
		map?: THREE.Texture
		color?: string
	}
	lightHalo?: {
		map?: THREE.Texture
		color?: string
	}
	lightPoint?: {
		map?: THREE.Texture
		color?: string
	}
	heignt?: number
	radius?: number
	delay?: number
}

/**
 * 光柱
 */
export default class LightPillar {
	config: ILightPillar
	group: THREE.Group
	height: number
	textureLoader: THREE.TextureLoader

	constructor(config: ILightPillar) {
		this.config = config
		this.group = new THREE.Group()
		this.height = this.config.heignt || 10

		if (!this.config.lightColumn?.map || !this.config.lightHalo?.map || !this.config.lightPoint?.map) {
			this.textureLoader = new THREE.TextureLoader()
		}

		const light01 = this.createLightColumn()
		light01.name = "lightPillar01"
		const light02 = light01.clone()
		light02.name = "lightPillar02"
		light02.rotateZ(Math.PI / 2)
		const bottomMesh = this.createLightPoint()
		const lightHalo = this.createLightHalo()

		this.group.add(lightHalo, bottomMesh, light01, light02)
		this.group.position.set(this.config.point.x, this.config.point.y, this.config.point.z)
	}

	// 创建光柱
	createLightColumn() {
		const geometry = new THREE.PlaneGeometry(this.height / 6.219, this.height)
		geometry.rotateX(Math.PI / 2)
		geometry.translate(0, 0, this.height / 2)
		const material = new THREE.MeshBasicMaterial({
			map: this.config.lightColumn?.map || this.textureLoader.load("./threejsDemo/map/lightColumn.png"),
			color: this.config.lightColumn?.color || 0x00ffff,
			transparent: true,
			depthWrite: false,
			side: THREE.DoubleSide
		})
		return new THREE.Mesh(geometry, material)
	}

	// 创建光圈
	createLightHalo() {
		const geometry = new THREE.PlaneGeometry(this.config.radius || 3, this.config.radius || 3)
		const material = new THREE.MeshBasicMaterial({
			map: this.config.lightHalo?.map || this.textureLoader.load("./threejsDemo/map/markingAperture.png"),
			color: this.config.lightHalo?.color || 0x00ffff,
			side: THREE.DoubleSide,
			opacity: 0,
			transparent: true,
			depthWrite: false
		})
		const mesh = new THREE.Mesh(geometry, material)
		mesh.name = "lightPillarHalo"
		const timeLine = gsap.timeline({
			repeat: -1,
			delay: this.config.delay ? random(0, 10) : 0
		})
		timeLine.to(mesh.scale, {
			x: 1.5,
			y: 1.5,
			z: 1.5,
			duration: 2,
			ease: "none"
		})
		timeLine.to(
			material,
			{
				opacity: 1,
				duration: 1,
				ease: "none"
			},
			"<"
		)
		timeLine.to(mesh.scale, {
			x: 5,
			y: 5,
			z: 5,
			duration: 2,
			ease: "none"
		})
		timeLine.to(
			material,
			{
				opacity: 0,
				duration: 2,
				ease: "none"
			},
			"<"
		)
		return mesh
	}

	// 创建标记点
	createLightPoint() {
		const geometry = new THREE.PlaneGeometry(3, 3)
		const material = new THREE.MeshBasicMaterial({
			map: this.config.lightPoint?.map || this.textureLoader.load("./threejsDemo/map/label.png"),
			color: this.config.lightPoint?.color || 0x00ffff,
			side: THREE.DoubleSide,
			transparent: true,
			depthWrite: false
		})
		const mesh = new THREE.Mesh(geometry, material)
		mesh.name = "lightPillarPoint"
		return mesh
	}
}
