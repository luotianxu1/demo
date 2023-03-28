import * as THREE from "three"

export default class RoomShapeMesh extends THREE.Mesh {
	room
	roomShapePoints
	declare geometry: THREE.ShapeGeometry
	declare material: THREE.MeshBasicMaterial
	isTop: boolean

	constructor(room: any, isTop: boolean) {
		super()
		this.room = room
		this.roomShapePoints = room.areas
		this.isTop = isTop
		this.init()
	}

	init() {
		const roomShape = new THREE.Shape()
		// 生成房间形状
		for (let i = 0; i < this.roomShapePoints.length; i++) {
			const point = this.roomShapePoints[i]
			if (i === 0) {
				roomShape.moveTo(point.x / 100, point.y / 100)
			} else {
				roomShape.lineTo(point.x / 100, point.y / 100)
			}
		}
		const roomShapeGeometry = new THREE.ShapeGeometry(roomShape)
		// 旋转几何体顶点
		roomShapeGeometry.rotateX(Math.PI / 2)
		this.geometry = roomShapeGeometry
		this.material = new THREE.MeshBasicMaterial({
			side: this.isTop ? THREE.FrontSide : THREE.DoubleSide,
			color: 0xff0000,
			transparent: true
		})
		this.isTop ? (this.position.y = 2.8) : (this.position.y = 0)
	}
}
