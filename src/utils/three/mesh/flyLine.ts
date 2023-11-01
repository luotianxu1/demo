import * as THREE from "three"
import gsap from "gsap"

/**
 * 飞线
 */
export default class FlyLine {
	lineCure: THREE.CatmullRomCurve3
	geometry: THREE.TubeGeometry
	material: THREE.MeshBasicMaterial
	mesh: THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial>
	texture: THREE.Texture

	constructor() {
		const linePoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 4, 0), new THREE.Vector3(8, 0, 0)]
		// 1、创建曲线
		this.lineCure = new THREE.CatmullRomCurve3(linePoints)
		// 2、根据曲线生成管道几何体
		this.geometry = new THREE.TubeGeometry(this.lineCure, 100, 0.4, 2, false)
		// 3、设置飞线材质
		// 创建纹理
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
