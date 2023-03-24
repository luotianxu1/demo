precision lowp float;

uniform vec3 uLowColor;
uniform vec3 uHeighColor;
uniform float uOpacity;

varying float vElevation;

void main() {
  float a = (vElevation + 1.0) / 2.0;
  vec3 color = mix(uLowColor,uHeighColor,a);
  gl_FragColor = vec4(color, uOpacity);
}
