import * as THREE from "three"
import gsap from "gsap"
import vertex from "@utils/three/shader/flyLine/vertex.glsl?raw"
import fragment from "@utils/three/shader/flyLine/fragment.glsl?raw"

/**
 * 着色器实现飞线
 */
export default class FlyLineShader {
	lineCurve: THREE.CatmullRomCurve3
	geometry: THREE.BufferGeometry
	shaderMaterial: THREE.ShaderMaterial
	mesh: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>

	constructor(position = { x: 0, z: 0 }, color = 0x00ffff) {
		const linePoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-4, 4, 0), new THREE.Vector3(-8, 0, 0)]

		// 1 创建曲线
		this.lineCurve = new THREE.CatmullRomCurve3(linePoints)
		const points = this.lineCurve.getPoints(1000)
		// 2 创建几何顶点
		this.geometry = new THREE.BufferGeometry().setFromPoints(points)
		// 给每一个顶点设置属性
		const aSizeArray = new Float32Array(points.length)
		for (let i = 0; i < aSizeArray.length; i++) {
			aSizeArray[i] = i
		}
		// 设置几何体顶点属性
		this.geometry.setAttribute("aSize", new THREE.BufferAttribute(aSizeArray, 1))
		// 3 设置着色器材质
		this.shaderMaterial = new THREE.ShaderMaterial({
			vertexShader: vertex,
			fragmentShader: fragment,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			uniforms: {
				uTime: {
					value: 0
				},
				uColor: {
					value: new THREE.Color(color)
				},
				uLength: {
					value: points.length
				}
			}
		})

		this.mesh = new THREE.Points(this.geometry, this.shaderMaterial)

		// 改变uTime来控制动画
		gsap.to(this.shaderMaterial.uniforms.uTime, {
			value: 1000,
			duration: 2,
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
