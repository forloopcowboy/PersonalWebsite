precision highp float;

#define PI 3.14159265359

varying vec2 vUv;
varying vec3 vNormalWS;
varying vec3 vPositionWS;

uniform vec3 u_baseColor;
uniform float u_metallic;
uniform float u_smoothness;
uniform float u_gridCols;
uniform float u_gridRows;

uniform sampler2D u_eyesTex;
uniform float u_eyesIndex;
uniform vec3 u_eyesTranslation;
uniform float u_eyesEnabled;

uniform sampler2D u_noseTex;
uniform float u_noseIndex;
uniform vec3 u_noseTranslation;
uniform float u_noseEnabled;

uniform sampler2D u_mouthTex;
uniform float u_mouthIndex;
uniform vec3 u_mouthTranslation;
uniform float u_mouthEnabled;

uniform sampler2D u_eyebrowsTex;
uniform float u_eyebrowsIndex;
uniform vec3 u_eyebrowsTranslation;
uniform float u_eyebrowsEnabled;

uniform sampler2D u_facialHairTex;
uniform float u_facialHairIndex;
uniform vec3 u_facialHairTranslation;
uniform float u_facialHairEnabled;

uniform sampler2D u_accessoryTex;
uniform float u_accessoryIndex;
uniform vec3 u_accessoryTranslation;
uniform float u_accessoryEnabled;

uniform vec3 u_lightDirection;
uniform vec3 u_lightColor;
uniform vec3 u_ambientColor;

// Returns: xy = atlas UV, z = inside bounds mask (1 or 0)
vec3 calculateFeatureUV(vec2 baseUV, float indexF, vec3 translationAndScale, float gridColsF, float gridRowsF) {
  int index = int(indexF);
  int gridCols = int(gridColsF);
  int gridRows = int(gridRowsF);

  vec2 translation = translationAndScale.xy;
  float scale = max(translationAndScale.z, 0.05);

  int cellCol = index - (index / gridCols) * gridCols; // index % gridCols
  int imageRow = index / gridCols;
  int cellRow = (gridRows - 1) - imageRow;

  float cellSizeU = 1.0 / float(gridCols);
  float cellSizeV = 1.0 / float(gridRows);

  vec2 cellMinUV = vec2(float(cellCol) * cellSizeU, float(cellRow) * cellSizeV);

  vec2 faceCenter = vec2(0.5, 0.5);
  vec2 featureCenter = faceCenter + translation;

  float deltaU = baseUV.x - featureCenter.x;
  float deltaV = baseUV.y - featureCenter.y;

  float uvAspectCorrection = 2.0;

  float latitude = (baseUV.y - 0.5) * PI;
  float cosLat = cos(latitude);

  float correctedDeltaU = deltaU * uvAspectCorrection * cosLat;

  vec2 localUV;
  localUV.x = correctedDeltaU / scale + 0.5;
  localUV.y = deltaV / scale + 0.5;

  float insideBounds = step(0.0, localUV.x) * step(localUV.x, 1.0) *
                       step(0.0, localUV.y) * step(localUV.y, 1.0);

  vec2 atlasUV = cellMinUV + localUV * vec2(cellSizeU, cellSizeV);

  return vec3(atlasUV, insideBounds);
}

void main() {
  vec4 finalColor = vec4(u_baseColor, 1.0);

  // Composite features bottom to top (same order as Unity shader)
  // Mouth
  if (u_mouthEnabled > 0.5) {
    vec3 uvData = calculateFeatureUV(vUv, u_mouthIndex, u_mouthTranslation, u_gridCols, u_gridRows);
    if (uvData.z > 0.5) {
      vec4 sample_ = texture2D(u_mouthTex, uvData.xy);
      finalColor.rgb = mix(finalColor.rgb, sample_.rgb, sample_.a);
    }
  }

  // Eyes
  if (u_eyesEnabled > 0.5) {
    vec3 uvData = calculateFeatureUV(vUv, u_eyesIndex, u_eyesTranslation, u_gridCols, u_gridRows);
    if (uvData.z > 0.5) {
      vec4 sample_ = texture2D(u_eyesTex, uvData.xy);
      finalColor.rgb = mix(finalColor.rgb, sample_.rgb, sample_.a);
    }
  }

  // Eyebrows
  if (u_eyebrowsEnabled > 0.5) {
    vec3 uvData = calculateFeatureUV(vUv, u_eyebrowsIndex, u_eyebrowsTranslation, u_gridCols, u_gridRows);
    if (uvData.z > 0.5) {
      vec4 sample_ = texture2D(u_eyebrowsTex, uvData.xy);
      finalColor.rgb = mix(finalColor.rgb, sample_.rgb, sample_.a);
    }
  }

  // Facial Hair
  if (u_facialHairEnabled > 0.5) {
    vec3 uvData = calculateFeatureUV(vUv, u_facialHairIndex, u_facialHairTranslation, u_gridCols, u_gridRows);
    if (uvData.z > 0.5) {
      vec4 sample_ = texture2D(u_facialHairTex, uvData.xy);
      finalColor.rgb = mix(finalColor.rgb, sample_.rgb, sample_.a);
    }
  }

  // Nose
  if (u_noseEnabled > 0.5) {
    vec3 uvData = calculateFeatureUV(vUv, u_noseIndex, u_noseTranslation, u_gridCols, u_gridRows);
    if (uvData.z > 0.5) {
      vec4 sample_ = texture2D(u_noseTex, uvData.xy);
      finalColor.rgb = mix(finalColor.rgb, sample_.rgb, sample_.a);
    }
  }

  // Accessories
  if (u_accessoryEnabled > 0.5) {
    vec3 uvData = calculateFeatureUV(vUv, u_accessoryIndex, u_accessoryTranslation, u_gridCols, u_gridRows);
    if (uvData.z > 0.5) {
      vec4 sample_ = texture2D(u_accessoryTex, uvData.xy);
      finalColor.rgb = mix(finalColor.rgb, sample_.rgb, sample_.a);
    }
  }

  // Lighting (sphere normal computed in vertex shader)
  vec3 albedo = finalColor.rgb;
  vec3 normalWS = normalize(vNormalWS);
  float NdotL = clamp(dot(normalWS, normalize(u_lightDirection)), 0.0, 1.0);

  vec3 diffuse = albedo * u_lightColor * NdotL;
  vec3 ambient = u_ambientColor * albedo;
  vec3 lighting = diffuse + ambient;

  gl_FragColor = vec4(lighting, finalColor.a);
}
