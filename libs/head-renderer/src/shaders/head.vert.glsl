#define PI 3.14159265359

varying vec2 vUv;
varying vec3 vNormalWS;
varying vec3 vPositionWS;

void main() {
  // Three.js SphereGeometry: V=0 at north pole, V=1 at south pole
  // Unity convention: V=0 at south pole, V=1 at north pole
  vUv = vec2(uv.x, 1.0 - uv.y);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vPositionWS = worldPos.xyz;

  // Compute smooth sphere normal from UV coordinates
  // Gives perfectly smooth normals regardless of mesh polygon count
  float theta = uv.x * 2.0 * PI;
  float phi = uv.y * PI;
  float sinPhi = sin(phi);
  vec3 sphereNormal;
  sphereNormal.x = sinPhi * sin(theta);
  sphereNormal.y = cos(phi);
  sphereNormal.z = -sinPhi * cos(theta);

  vNormalWS = normalize(normalMatrix * sphereNormal);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
