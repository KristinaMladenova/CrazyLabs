import { WebGLRenderer, PerspectiveCamera, PCFShadowMap } from "three";
import RunningScene from "./scenes/running-scene";

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
renderer.shadowMap.type = PCFShadowMap;

const runningScene = new RunningScene();

const render = () => {
  runningScene.planePosition();
  renderer.render(runningScene, mainCamera);
  requestAnimationFrame(render);
};

render();
