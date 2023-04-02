import { WebGLRenderer, PerspectiveCamera, PCFSoftShadowMap } from "three";
import RunningScene from "./scenes/running-scene";

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new WebGLRenderer({
  canvas: document.getElementById("app") as HTMLCanvasElement,
  alpha: true,
  antialias: true,
  precision: "mediump",
});

const mainCamera = new PerspectiveCamera(100, width / height, 0.1, 100);
mainCamera.rotateX(-150);
mainCamera.position.z = 0;
mainCamera.position.y = 1;

function onWindowResize() {
  mainCamera.aspect = window.innerWidth / window.innerHeight;

  mainCamera.position.z = 5;
  mainCamera.position.y = 1;
  mainCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

const runningScene = new RunningScene();

const render = () => {
  renderer.render(runningScene, mainCamera);
  requestAnimationFrame(render);
};

const main = async () => {
  await runningScene.load();
  runningScene.initialize();
  render();
};

main();

function loop() {
  renderer.setAnimationLoop(() => {
    if (runningScene.clock.getElapsedTime() < 10) {
      runningScene.update();
    } else {
      document.getElementById("game-over-modal")!.style.display = "flex";
    }
  });
}

document.getElementById("app")?.addEventListener("click", () => {
  loop();
});
