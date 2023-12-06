import { lon2xyz } from "@/utils/three/utils"
import * as THREE from "three"

// 光柱底座矩形平面
export const createPointMesh = (options: { radius: number; lon: number; lat: number; material: THREE.MeshBasicMaterial }) => {
	const geometry = new THREE.PlaneGeometry(1, 1) //默认在XOY平面上
	const mesh = new THREE.Mesh(geometry, options.material)
	// 经纬度转球面坐标
	const coord = lon2xyz(options.radius * 1.001, options.lon, options.lat)
	const size = options.radius * 0.05 // 矩形平面Mesh的尺寸
	mesh.scale.set(size, size, size) // 设置mesh大小

	// 设置mesh位置
	mesh.position.set(coord.x, coord.y, coord.z)
	const coordVec3 = new THREE.Vector3(coord.x, coord.y, coord.z).normalize()
	const meshNormal = new THREE.Vector3(0, 0, 1)
	mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3)
	return mesh
}

// 创建柱状
export const createLightPillar = (options: {
	radius: number
	lon: number
	lat: number
	index: number
	textures: THREE.Texture
	punctuation
}) => {
	const height = options.radius * 0.3
	const geometry = new THREE.PlaneGeometry(options.radius * 0.05, height)
	geometry.rotateX(Math.PI / 2)
	geometry.translate(0, 0, height / 2)
	const material = new THREE.MeshBasicMaterial({
		map: options.textures,
		color: options.index === 0 ? options.punctuation.lightColumn.startColor : options.punctuation.lightColumn.endColor,
		transparent: true,
		side: THREE.DoubleSide,
		depthWrite: false //是否对深度缓冲区有任何的影响
	})
	const mesh = new THREE.Mesh(geometry, material)
	const group = new THREE.Group()
	// 两个光柱交叉叠加
	group.add(mesh, mesh.clone().rotateZ(Math.PI / 2)) //几何体绕x轴旋转了，所以mesh旋转轴变为z
	// 经纬度转球面坐标
	const SphereCoord = lon2xyz(options.radius, options.lon, options.lat) //SphereCoord球面坐标
	group.position.set(SphereCoord.x, SphereCoord.y, SphereCoord.z) //设置mesh位置
	const coordVec3 = new THREE.Vector3(SphereCoord.x, SphereCoord.y, SphereCoord.z).normalize()
	const meshNormal = new THREE.Vector3(0, 0, 1)
	group.quaternion.setFromUnitVectors(meshNormal, coordVec3)
	return group
}

// 创建波动光圈
export const createWaveMesh = (options: { radius; lon; lat; textures }) => {
	const geometry = new THREE.PlaneGeometry(1, 1) //默认在XOY平面上
	const texture = options.textures

	const material = new THREE.MeshBasicMaterial({
		color: 0xe99f68,
		map: texture,
		transparent: true, //使用背景透明的png贴图，注意开启透明计算
		opacity: 1.0,
		depthWrite: false //禁止写入深度缓冲区数据
	})
	const mesh = new THREE.Mesh(geometry, material)
	// 经纬度转球面坐标
	const coord = lon2xyz(options.radius * 1.001, options.lon, options.lat)
	const size = options.radius * 0.12 //矩形平面Mesh的尺寸
	mesh.scale.set(size, size, size) //设置mesh大小
	mesh.userData["size"] = size //自顶一个属性，表示mesh静态大小
	mesh.userData["scale"] = Math.random() * 1.0 //自定义属性._s表示mesh在原始大小基础上放大倍数  光圈在原来mesh.size基础上1~2倍之间变化
	mesh.position.set(coord.x, coord.y, coord.z)
	const coordVec3 = new THREE.Vector3(coord.x, coord.y, coord.z).normalize()
	const meshNormal = new THREE.Vector3(0, 0, 1)
	mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3)
	return mesh
}
