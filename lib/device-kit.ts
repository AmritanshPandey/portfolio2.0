/**
 * What the device models use of three.js, in one chunk, and no more: naming
 * the parts (rather than importing all of three) lets the bundler drop the
 * rest. Loaded through loadDeviceKit (lib/device-model.ts).
 */
export {
  ACESFilmicToneMapping,
  Box3,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  CompressedCubeTexture,
  DataUtils,
  DirectionalLight,
  Group,
  HalfFloatType,
  HemisphereLight,
  LinearFilter,
  LinearMipmapLinearFilter,
  LinearSRGBColorSpace,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  RGBAFormat,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
} from "three"
export { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
export { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
export { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js"
