import * as THREE from "three";

class RunningScene extends THREE.Scene {
  private geometry = new THREE.PlaneGeometry(1.5, 500);
  private material = new THREE.MeshPhongMaterial({ color: 0x616497 });
  private plane = new THREE.Mesh(this.geometry, this.material);
  
  public fog;
  public fogColor = 0xb4d3ef;
  public density = 0.2;

  constructor() {
    super();

    this.fog = new THREE.FogExp2(this.fogColor, this.density);
    this.plane.receiveShadow = true;
    this.plane.position.y = 0;
    this.plane.rotation.x = 0;
    this.plane.position.z = -2.5;

    const playerSize = new THREE.CylinderGeometry(0.05, 0.05, 0.06, 3);
    const playerMaterial = new THREE.MeshPhongMaterial({ color: 0x4d3d64 });
    const player = new THREE.Mesh(playerSize, playerMaterial);
    player.position.z = -0.3;
    player.position.y = -0.1;
    player.rotation.x = 3.5;
    player.castShadow = true; //default is false
    player.receiveShadow = true; //default

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1.4, 3.6, 8);

    const frustumSize = 80;

    light.castShadow = true;
    light.shadow.mapSize.width = innerWidth;
    light.shadow.mapSize.height = innerHeight;

    light.shadow.camera = new THREE.OrthographicCamera(
      -frustumSize / 2,
      frustumSize / 2,
      frustumSize / 2,
      -frustumSize / 2,
      1,
      frustumSize
    );

    // Same position as LIGHT position.
    light.shadow.camera.position.copy(light.position);
    light.shadow.camera.lookAt(player.position);
    this.add(light.shadow.camera);

    this.add(this.plane);
    this.add(player);
    this.add(ambient);
    this.add(light);
  }

  planePosition() {
    this.plane.rotation.y = 0;
    this.plane.rotation.x = 5;
  };

  // kako planePosition isto taka nadole dodavaj metodi
}

export default RunningScene;
