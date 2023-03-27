precision lowp float;

uniform vec3 uColor;

void main() {
  float distanceToCenter = distance(gl_PointCoord,vec2(0.5));
  distanceToCenter *= 2.0;
  distanceToCenter = 1.0 - distanceToCenter;
  float strength = pow(distanceToCenter,1.5);
  gl_FragColor = vec4(uColor,strength);
}
