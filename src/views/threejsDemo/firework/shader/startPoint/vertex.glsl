precision lowp float;

attribute vec3 aStep;

uniform float uTime;
uniform float uSize;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position,1.0);
  modelPosition.xyz += (aStep * uTime);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  // 设置点大小
  gl_PointSize = uSize;
}
