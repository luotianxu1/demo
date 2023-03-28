import * as THREE from "three"

export default function WallShaderMaterial(panarama: any): THREE.ShaderMaterial {
	const point = panarama.point[0]
	const panaramaTexture = new THREE.TextureLoader().load(point.panoramaUrl)
	panaramaTexture.flipY = false
	panaramaTexture.wrapS = THREE.RepeatWrapping
	panaramaTexture.wrapT = THREE.RepeatWrapping
	const center = new THREE.Vector3(point.x / 100, point.z / 100, point.y / 100)
	return new THREE.ShaderMaterial({
		uniforms: {
			uPanorama: {
				value: panaramaTexture
			},
			uCenter: {
				value: center
			}
		},
		vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform vec3 uCenter;
      void main() {
        vUv = uv;
        vec4 modelpos = modelMatrix * vec4(position, 1.0);
        vPosition = modelpos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
		fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform sampler2D uPanorama;
      uniform vec3 uCenter;
      void main() {
        vec3 nPos = normalize(vPosition - uCenter);
        float theta = acos(nPos.y) / 3.14;
        float phi = (atan(nPos.z,nPos.x) + 3.14) / 6.28;
        phi += 0.75;
        gl_FragColor = texture2D(uPanorama, vec2(phi, theta));
      }
    `
	})
}
