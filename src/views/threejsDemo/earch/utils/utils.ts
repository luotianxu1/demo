import { lon2xyz } from "@/utils/three/utils"
import * as THREE from "three"

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

// 创建线
export const createAnimateLine = option => {
	// 由多个点数组构成的曲线 通常用于道路
	const l = []
	option.pointList.forEach(e => l.push(new THREE.Vector3(e[0], e[1], e[2])))
	const curve = new THREE.CatmullRomCurve3(l) // 曲线路径

	// 管道体
	const tubeGeometry = new THREE.TubeGeometry(curve, option.number || 50, option.radius || 1, option.radialSegments)
	return new THREE.Mesh(tubeGeometry, option.material)
}

/**输入地球上任意两点的经纬度坐标，通过函数flyArc可以绘制一个飞线圆弧轨迹
 * lon1,lat1:轨迹线起点经纬度坐标
 * lon2,lat2：轨迹线结束点经纬度坐标
 */
export const flyArc = (radius, lon1, lat1, lon2, lat2, options) => {
	const sphereCoord1 = lon2xyz(radius, lon1, lat1) //经纬度坐标转球面坐标
	// startSphereCoord：轨迹线起点球面坐标
	const startSphereCoord = new THREE.Vector3(sphereCoord1.x, sphereCoord1.y, sphereCoord1.z)
	const sphereCoord2 = lon2xyz(radius, lon2, lat2)
	// startSphereCoord：轨迹线结束点球面坐标
	const endSphereCoord = new THREE.Vector3(sphereCoord2.x, sphereCoord2.y, sphereCoord2.z)

	//计算绘制圆弧需要的关于y轴对称的起点、结束点和旋转四元数
	const startEndQua = _3Dto2D(startSphereCoord, endSphereCoord)
	// 调用arcXOY函数绘制一条圆弧飞线轨迹
	const arcline = arcXOY(radius, startEndQua.startPoint, startEndQua.endPoint, options)
	arcline.quaternion.multiply(startEndQua.quaternion)
	return arcline
}

/**通过函数arcXOY()可以在XOY平面上绘制一个关于y轴对称的圆弧曲线
 * startPoint, endPoint：表示圆弧曲线的起点和结束点坐标值，起点和结束点关于y轴对称
 * 同时在圆弧轨迹的基础上绘制一段飞线*/
function arcXOY(radius, startPoint, endPoint, options) {
	// 计算两点的中点
	const middleV3 = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5)
	// 弦垂线的方向dir(弦的中点和圆心构成的向量)
	const dir = middleV3.clone().normalize()
	// 计算球面飞线的起点、结束点和球心构成夹角的弧度值
	const earthRadianAngle = radianAOB(startPoint, endPoint, new THREE.Vector3(0, 0, 0))
	/*设置飞线轨迹圆弧的中间点坐标
  弧度值 * radius * 0.2：表示飞线轨迹圆弧顶部距离地球球面的距离
  起点、结束点相聚越远，构成的弧线顶部距离球面越高*/
	const arcTopCoord = dir.multiplyScalar(radius + earthRadianAngle * radius * 0.2) // 黄色飞行线的高度
	//求三个点的外接圆圆心(飞线圆弧轨迹的圆心坐标)
	const flyArcCenter = threePointCenter(startPoint, endPoint, arcTopCoord)
	// 飞线圆弧轨迹半径flyArcR
	const flyArcR = Math.abs(flyArcCenter.y - arcTopCoord.y)
	/*坐标原点和飞线起点构成直线和y轴负半轴夹角弧度值
  参数分别是：飞线圆弧起点、y轴负半轴上一点、飞线圆弧圆心*/
	const flyRadianAngle = radianAOB(startPoint, new THREE.Vector3(0, -1, 0), flyArcCenter)
	const startAngle = -Math.PI / 2 + flyRadianAngle //飞线圆弧开始角度
	const endAngle = Math.PI - startAngle //飞线圆弧结束角度
	// 调用圆弧线模型的绘制函数
	const arcline: any = circleLine(flyArcCenter.x, flyArcCenter.y, flyArcR, startAngle, endAngle, options.color)
	// const arcline = new  Group();// 不绘制轨迹线，使用 Group替换circleLine()即可
	arcline.center = flyArcCenter //飞线圆弧自定一个属性表示飞线圆弧的圆心
	arcline.topCoord = arcTopCoord //飞线圆弧自定一个属性表示飞线圆弧中间也就是顶部坐标

	// const flyAngle = Math.PI/ 10; //飞线圆弧固定弧度
	const flyAngle = (endAngle - startAngle) / 7 //飞线圆弧的弧度和轨迹线弧度相关
	// 绘制一段飞线，圆心做坐标原点
	const flyLine: any = createFlyLine(flyArcR, startAngle, startAngle + flyAngle, options.flyLineColor)
	flyLine.position.y = flyArcCenter.y //平移飞线圆弧和飞线轨迹圆弧重合
	//飞线段flyLine作为飞线轨迹arcLine子对象，继承飞线轨迹平移旋转等变换
	arcline.add(flyLine)
	//飞线段运动范围startAngle~flyEndAngle
	flyLine.flyEndAngle = endAngle - startAngle - flyAngle
	flyLine.startAngle = startAngle
	// arcline.flyEndAngle：飞线段当前角度位置，这里设置了一个随机值用于演示
	flyLine.AngleZ = arcline.flyEndAngle * Math.random()
	// flyLine.rotation.z = arcline.AngleZ;
	// arcline.flyLine指向飞线段,便于设置动画是访问飞线段
	arcline.userData["flyLine"] = flyLine

	return arcline
}

/*计算球面上两点和球心构成夹角的弧度值
参数point1, point2:表示地球球面上两点坐标Vector3
计算A、B两点和顶点O构成的AOB夹角弧度值*/
function radianAOB(A, B, O) {
	// dir1、dir2：球面上两个点和球心构成的方向向量
	const dir1 = A.clone().sub(O).normalize()
	const dir2 = B.clone().sub(O).normalize()
	//点乘.dot()计算夹角余弦值
	const cosAngle = dir1.clone().dot(dir2)
	const radianAngle = Math.acos(cosAngle) //余弦值转夹角弧度值,通过余弦值可以计算夹角范围是0~180度
	return radianAngle
}

//求三个点的外接圆圆心，p1, p2, p3表示三个点的坐标Vector3。
function threePointCenter(p1, p2, p3) {
	const L1 = p1.lengthSq() //p1到坐标原点距离的平方
	const L2 = p2.lengthSq()
	const L3 = p3.lengthSq()
	const x1 = p1.x,
		y1 = p1.y,
		x2 = p2.x,
		y2 = p2.y,
		x3 = p3.x,
		y3 = p3.y
	const S = x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2
	const x = (L2 * y3 + L1 * y2 + L3 * y1 - L2 * y1 - L3 * y2 - L1 * y3) / S / 2
	const y = (L3 * x2 + L2 * x1 + L1 * x3 - L1 * x2 - L2 * x3 - L3 * x1) / S / 2
	// 三点外接圆圆心坐标
	const center = new THREE.Vector3(x, y, 0)
	return center
}

/*绘制一条圆弧曲线模型Line
5个参数含义：(圆心横坐标, 圆心纵坐标, 飞线圆弧轨迹半径, 开始角度, 结束角度)*/
function circleLine(x, y, r, startAngle, endAngle, color) {
	const geometry = new THREE.BufferGeometry() //声明一个几何体对象Geometry
	//  ArcCurve创建圆弧曲线
	const arc = new THREE.ArcCurve(x, y, r, startAngle, endAngle, false)
	//getSpacedPoints是基类Curve的方法，返回一个vector2对象作为元素组成的数组
	const points = arc.getSpacedPoints(80) //分段数50，返回51个顶点
	geometry.setFromPoints(points) // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
	const material = new THREE.LineBasicMaterial({
		color: color || 0xd18547
	}) //线条材质
	const line = new THREE.Line(geometry, material) //线条模型对象
	return line
}

/*
 * 绘制一条圆弧飞线
 * 5个参数含义：( 飞线圆弧轨迹半径, 开始角度, 结束角度)
 */
function createFlyLine(radius, startAngle, endAngle, color) {
	const geometry = new THREE.BufferGeometry() //声明一个几何体对象BufferGeometry
	//  ArcCurve创建圆弧曲线
	const arc = new THREE.ArcCurve(0, 0, radius, startAngle, endAngle, false)
	//getSpacedPoints是基类Curve的方法，返回一个vector2对象作为元素组成的数组
	const pointsArr = arc.getSpacedPoints(100) //分段数80，返回81个顶点
	geometry.setFromPoints(pointsArr) // setFromPoints方法从pointsArr中提取数据改变几何体的顶点属性vertices
	// 每个顶点对应一个百分比数据attributes.percent 用于控制点的渲染大小
	const percentArr = [] //attributes.percent的数据
	for (let i = 0; i < pointsArr.length; i++) {
		percentArr.push(i / pointsArr.length)
	}
	const percentAttribue = new THREE.BufferAttribute(new Float32Array(percentArr), 1)
	// 通过顶点数据percent点模型从大到小变化，产生小蝌蚪形状飞线
	geometry.attributes.percent = percentAttribue
	// 批量计算所有顶点颜色数据
	const colorArr = []
	for (let i = 0; i < pointsArr.length; i++) {
		const color1 = new THREE.Color(0xec8f43) //轨迹线颜色 青色
		const color2 = new THREE.Color(0xf3ae76) //黄色
		const color = color1.lerp(color2, i / pointsArr.length)
		colorArr.push(color.r, color.g, color.b)
	}
	// 设置几何体顶点颜色数据
	geometry.attributes.color = new THREE.BufferAttribute(new Float32Array(colorArr), 3)
	const size = 1.3
	// 点模型渲染几何体每个顶点
	const material = new THREE.PointsMaterial({
		size, //点大小
		// vertexColors: VertexColors, //使用顶点颜色渲染
		transparent: true,
		depthWrite: false
	})
	// 修改点材质的着色器源码(注意：不同版本细节可能会稍微会有区别，不过整体思路是一样的)
	material.onBeforeCompile = function (shader) {
		// 顶点着色器中声明一个attribute变量:百分比
		shader.vertexShader = shader.vertexShader.replace(
			"void main() {",
			[
				"attribute float percent;", //顶点大小百分比变量，控制点渲染大小
				"void main() {"
			].join("\n") // .join()把数组元素合成字符串
		)
		// 调整点渲染大小计算方式
		shader.vertexShader = shader.vertexShader.replace(
			"gl_PointSize = size;",
			["gl_PointSize = percent * size;"].join("\n") // .join()把数组元素合成字符串
		)
	}
	const FlyLine = new THREE.Points(geometry, material)
	material.color = new THREE.Color(color)
	FlyLine.name = "飞行线"

	return FlyLine
}

/*
 * 把3D球面上任意的两个飞线起点和结束点绕球心旋转到到XOY平面上，
 * 同时保持关于y轴对称，借助旋转得到的新起点和新结束点绘制
 * 一个圆弧，最后把绘制的圆弧反向旋转到原来的起点和结束点即可
 */
function _3Dto2D(startSphere, endSphere) {
	/*计算第一次旋转的四元数：表示从一个平面如何旋转到另一个平面*/
	const origin = new THREE.Vector3(0, 0, 0) //球心坐标
	const startDir = startSphere.clone().sub(origin) //飞线起点与球心构成方向向量
	const endDir = endSphere.clone().sub(origin) //飞线结束点与球心构成方向向量
	// dir1和dir2构成一个三角形，.cross()叉乘计算该三角形法线normal
	const normal = startDir.clone().cross(endDir).normalize()
	const xoyNormal = new THREE.Vector3(0, 0, 1) //XOY平面的法线
	//.setFromUnitVectors()计算从normal向量旋转达到xoyNormal向量所需要的四元数
	// quaternion表示把球面飞线旋转到XOY平面上需要的四元数
	const quaternion3D_XOY = new THREE.Quaternion().setFromUnitVectors(normal, xoyNormal)
	/*第一次旋转：飞线起点、结束点从3D空间第一次旋转到XOY平面*/
	const startSphereXOY = startSphere.clone().applyQuaternion(quaternion3D_XOY)
	const endSphereXOY = endSphere.clone().applyQuaternion(quaternion3D_XOY)

	/*计算第二次旋转的四元数*/
	// middleV3：startSphereXOY和endSphereXOY的中点
	const middleV3 = startSphereXOY.clone().add(endSphereXOY).multiplyScalar(0.5)
	const midDir = middleV3.clone().sub(origin).normalize() // 旋转前向量midDir，中点middleV3和球心构成的方向向量
	const yDir = new THREE.Vector3(0, 1, 0) // 旋转后向量yDir，即y轴
	// .setFromUnitVectors()计算从midDir向量旋转达到yDir向量所需要的四元数
	// quaternion2表示让第一次旋转到XOY平面的起点和结束点关于y轴对称需要的四元数
	const quaternionXOY_Y = new THREE.Quaternion().setFromUnitVectors(midDir, yDir)

	/*第二次旋转：使旋转到XOY平面的点再次旋转，实现关于Y轴对称*/
	const startSpherXOY_Y = startSphereXOY.clone().applyQuaternion(quaternionXOY_Y)
	const endSphereXOY_Y = endSphereXOY.clone().applyQuaternion(quaternionXOY_Y)

	/**一个四元数表示一个旋转过程
	 *.invert()方法表示四元数的逆，简单说就是把旋转过程倒过来
	 * 两次旋转的四元数执行.invert()求逆，然后执行.multiply()相乘
	 *新版本.invert()对应旧版本.invert()
	 */
	const quaternionInverse = quaternion3D_XOY.clone().invert().multiply(quaternionXOY_Y.clone().invert())
	return {
		// 返回两次旋转四元数的逆四元数
		quaternion: quaternionInverse,
		// 范围两次旋转后在XOY平面上关于y轴对称的圆弧起点和结束点坐标
		startPoint: startSpherXOY_Y,
		endPoint: endSphereXOY_Y
	}
}
