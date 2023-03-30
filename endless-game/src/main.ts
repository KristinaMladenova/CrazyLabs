import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  MeshPhongMaterial,
  Mesh,
  DirectionalLight,
  AmbientLight,
  PlaneGeometry,
  Fog,
  FogExp2,
  Object3D,
  BoxGeometry,
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

const geometry = new PlaneGeometry(1.5, 500);
const material = new MeshPhongMaterial({ color: 0x616497 });
const plane = new Mesh(geometry, material);
plane.position.z = -2.5;

const scene = new Scene();
{
  const color = 0xb4d3ef;
  const density = 0.2;
  scene.fog = new FogExp2(color, density);
}

const playerSize = new PlaneGeometry(0.1, 0.1);
const playerMaterial = new MeshPhongMaterial({ color: 0x616497 });
const player = new Mesh(playerSize, playerMaterial);
player.position.z = -1;
player.position.y = -0.4;

scene.add(player);
scene.add(plane);

const planePosition = () => {
  plane.rotation.y = 0;
  plane.rotation.x = 5;
};

const ambient = new AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const light = new DirectionalLight(0xffffff, 1);

light.position.set(0, 40, -10);
light.castShadow = true;
scene.add(light);

light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

const render = () => {
  planePosition();
  renderer.render(scene, mainCamera);
  requestAnimationFrame(render);
};
render();
