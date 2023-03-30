import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  MeshPhongMaterial,
  MeshBasicMaterial,
  Mesh,
  DirectionalLight,
  AmbientLight,
  PlaneGeometry,
  FogExp2,
  CylinderGeometry,
  PCFSoftShadowMap,
  BoxGeometry,
  OrthographicCamera,
  VSMShadowMap,
  BasicShadowMap,
  PCFShadowMap,
} from "three";

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new WebGLRenderer({
  canvas: document.getElementById("app") as HTMLCanvasElement,
  alpha: true,
  antialias: true,
  precision: "mediump",
});

const mainCamera = new PerspectiveCamera(60, width / height, 0.1, 1000);
function onWindowResize() {
  mainCamera.aspect = window.innerWidth / window.innerHeight;
  mainCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = BasicShadowMap;

const scene = new Scene();
{
  const color = 0xb4d3ef;
  const density = 0.2;
  scene.fog = new FogExp2(color, density);
}

const ambient = new AmbientLight(0xffffff, 0.5);

const light = new DirectionalLight(0xffffff, 1);
light.position.set(0.3, 0.5, 1);

const frustumSize = 80;

light.castShadow = true;
light.shadow.mapSize.width = innerWidth;
light.shadow.mapSize.height = innerHeight;

light.shadow.camera = new OrthographicCamera(
  -frustumSize / 2,
  frustumSize / 2,
  frustumSize / 2,
  -frustumSize / 2,
  1,
  frustumSize
);

// Same position as LIGHT position.
light.shadow.camera.position.copy(light.position);
light.shadow.camera.lookAt(scene.position);
scene.add(light.shadow.camera);

const geometry = new PlaneGeometry(1.5, 500);
const material = new MeshPhongMaterial({ color: 0x616497 });
const plane = new Mesh(geometry, material);
plane.receiveShadow = true;
plane.position.y = -0.1;
plane.rotation.x = 3.5;
plane.position.z = -2.5;

const playerSize = new CylinderGeometry(0.08, 0.08, 0.06, 3);
const playerMaterial = new MeshPhongMaterial({ color: 0x4d3d64 });
const player = new Mesh(playerSize, playerMaterial);
player.position.z = -0.3;
player.position.y = -0.1;
player.rotation.x = 3.5;
player.castShadow = true; //default is false
player.receiveShadow = true; //default

scene.add(plane);
scene.add(player);
scene.add(ambient);
scene.add(light);

const planePosition = () => {
  plane.rotation.y = 0;
  plane.rotation.x = 5;
};

const render = () => {
  planePosition();
  renderer.render(scene, mainCamera);
  requestAnimationFrame(render);
};
render();
