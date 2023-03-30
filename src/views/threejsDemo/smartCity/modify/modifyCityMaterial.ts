import * as THREE from "three"
import type { Box3 } from "three"
import gsap from "gsap"

export default function modifyCityMaterial(mesh: THREE.Mesh) {
	;(mesh.material as THREE.MeshBasicMaterial).onBeforeCompile = shader => {
		shader.fragmentShader = shader.fragmentShader.replace(
			"#include <dithering_fragment>",
			`
      #include <dithering_fragment>
      //#end#
      `
		)
		addGradColor(shader, mesh)
		addSpread(shader)
		addLightLine(shader)
		addToTopLine(shader)
	}
}

/**
 * 根据高度计算渐变颜色
 * @param shader 着色器
 * @param mesh 物体
 */
export function addGradColor(shader: THREE.Shader, mesh: THREE.Mesh) {
	// 计算外边界矩形
	mesh.geometry.computeBoundingBox()
	// 获取物体高度差
	const { min, max } = mesh.geometry.boundingBox as Box3
	const uHeight = max.y - min.y

	shader.uniforms.uHeight = {
		value: uHeight
	}
	shader.uniforms.uTopColor = {
		value: new THREE.Color("#aaaeff")
	}
	shader.vertexShader = shader.vertexShader.replace(
		"#include <common>",
		`
    #include <common>
    varying vec3 vPosition;
    `
	)
	shader.vertexShader = shader.vertexShader.replace(
		"#include <begin_vertex>",
		`
    #include <begin_vertex>
    vPosition = position;
    `
	)
	shader.fragmentShader = shader.fragmentShader.replace(
		"#include <common>",
		`
    #include <common>
    uniform vec3 uTopColor;
    uniform float uHeight;
    varying vec3 vPosition;
    `
	)
	shader.fragmentShader = shader.fragmentShader.replace(
		"//#end#",
		`
    vec4 distGradColor = gl_FragColor;
    // 设置混合百分比
    float gradMix = (vPosition.y + uHeight / 2.0) / uHeight;
    // 计算出混合颜色
    vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
    gl_FragColor = vec4(gradMixColor, 1.0);
    //#end#
    `
	)
}

/**
 * 添加光环扩散
 * @param shader 着色器
 */
export function addSpread(shader: THREE.Shader) {
	// 扩散中心点
	shader.uniforms.uSpreadCenter = {
		value: new THREE.Vector2(0, 0)
	}
	// 扩散时间
	shader.uniforms.uSpreadTime = {
		value: 0
	}
	// 条带宽度
	shader.uniforms.uSpreadWidth = {
		value: 40
	}
	shader.fragmentShader = shader.fragmentShader.replace(
		"#include <common>",
		`
    #include <common>
    uniform vec2 uSpreadCenter;
    uniform float uSpreadTime;
    uniform float uSpreadWidth;
    `
	)
	shader.fragmentShader = shader.fragmentShader.replace(
		"//#end#",
		`
    float spreadRadius = distance(vPosition.xz,uSpreadCenter);
    // 扩散范围的函数
    float spreadIndex = -(spreadRadius - uSpreadTime) * (spreadRadius - uSpreadTime) + uSpreadWidth;
    if(spreadIndex > 0.0) {
      gl_FragColor = mix(gl_FragColor,vec4(1,1,1,1),spreadIndex / uSpreadWidth);
    }
    //#end#
    `
	)
	gsap.to(shader.uniforms.uSpreadTime, {
		value: 800,
		duration: 2,
		ease: "none",
		repeat: -1
	})
}

/**
 * 添加光带
 * @param shader 着色器
 */
export function addLightLine(shader: THREE.Shader) {
	// 扩散时间
	shader.uniforms.uLightLineTime = {
		value: -1500
	}
	// 条带宽度
	shader.uniforms.uLightLineWidth = {
		value: 400
	}
	shader.fragmentShader = shader.fragmentShader.replace(
		"#include <common>",
		`
    #include <common>
    uniform float uLightLineTime;
    uniform float uLightLineWidth;
    `
	)
	shader.fragmentShader = shader.fragmentShader.replace(
		"//#end#",
		`
    float LightLineMix = -(vPosition.x + vPosition.z - uLightLineTime) * (vPosition.x + vPosition.z - uLightLineTime) + uLightLineWidth;
    if(LightLineMix > 0.0) {
      gl_FragColor = mix(gl_FragColor,vec4(0.8,1.0,1.0,1),LightLineMix / uLightLineWidth);
    }
    //#end#
    `
	)
	gsap.to(shader.uniforms.uLightLineTime, {
		value: 1500,
		duration: 4,
		ease: "none",
		repeat: -1
	})
}

/**
 * 自底向上扫描
 * @param shader
 */
export function addToTopLine(shader: THREE.Shader) {
	// 扩散时间
	shader.uniforms.uToTopTime = {
		value: 0
	}
	// 条带宽度
	shader.uniforms.uToTopWidth = {
		value: 40
	}
	shader.fragmentShader = shader.fragmentShader.replace(
		"#include <common>",
		`
    #include <common>
    uniform float uToTopTime;
    uniform float uToTopWidth;
    `
	)
	shader.fragmentShader = shader.fragmentShader.replace(
		"//#end#",
		`
    float ToTopMix = -(vPosition.y - uToTopTime) * (vPosition.y - uToTopTime) + uToTopWidth;
    if(ToTopMix > 0.0) {
      gl_FragColor = mix(gl_FragColor,vec4(0.8,0.8,1,1),ToTopMix / uToTopWidth);
    }
    //#end#
    `
	)
	gsap.to(shader.uniforms.uToTopTime, {
		value: 200,
		duration: 4,
		ease: "none",
		repeat: -1
	})
}
