import * as THREE from "three"
import gsap from "gsap"

export interface IFlyLineTexture {
	source: {
		x: number
		y: number
		z: number
	}
	target: {
		x: number
		y: number
		z: number
	}
	url: string
	heignt: number
	radius: number
}

/**
 * 飞线
 */
export default class FlyLineTexture {
	config: IFlyLineTexture
	lineCure: THREE.CatmullRomCurve3
	geometry: THREE.TubeGeometry
	material: THREE.MeshBasicMaterial
	mesh: THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial>
	texture: THREE.Texture

	constructor(config: IFlyLineTexture) {
		this.config = config
		const formPosition = new THREE.Vector3(config.source.x, config.source.y, config.source.z)
		const toPosition = new THREE.Vector3(config.target.x, config.target.y, config.target.z)
		const centerPosition = formPosition.clone().lerp(toPosition, 0.5)
		centerPosition.setY(this.config.heignt)

		const linePoints = [formPosition, centerPosition, toPosition]
		// 1、创建曲线
		this.lineCure = new THREE.CatmullRomCurve3(linePoints)
		// 2、根据曲线生成管道几何体
		this.geometry = new THREE.TubeGeometry(this.lineCure, 64, this.config.radius, 2, false)
		// 3、设置飞线材质
		const textLoader = new THREE.TextureLoader()
		this.texture = textLoader.load("./threejsDemo/smartCity/z_11.png")
		this.texture.repeat.set(1, 2)
		this.texture.wrapS = THREE.RepeatWrapping
		this.texture.wrapT = THREE.MirroredRepeatWrapping
		this.material = new THREE.MeshBasicMaterial({
			color: 0xfff000,
			map: this.texture,
			transparent: true
		})
		// 4、添加飞线
		this.mesh = new THREE.Mesh(this.geometry, this.material)
		// 5、创建飞线动画
		gsap.to(this.texture.offset, {
			x: -1,
			duration: 1,
			repeat: -1,
			ease: "none"
		})
	}

	remove() {
		this.mesh.remove()
		this.mesh.removeFromParent()
		this.mesh.geometry.dispose()
		this.mesh.material.dispose()
	}
}
