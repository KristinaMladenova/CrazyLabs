import * as THREE from "three";

export default class GameScene extends THREE.Scene {
  public clock = new THREE.Clock();

  private geometry = new THREE.PlaneGeometry(2, 40);
  private material = new THREE.MeshPhongMaterial({ color: 0x616497 });

  public fogColor = 0xb4d3ef;
  public density = 0.2;

  private plane = new THREE.Mesh(this.geometry, this.material);

  private playerSize = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 3);
  private playerMaterial = new THREE.MeshPhongMaterial({ color: 0x4d3d64 });
  private player = new THREE.Mesh(this.playerSize, this.playerMaterial);

  private spheres: THREE.Mesh[] = [];
  private scores = 0;

  private generateSpheres() {
    for (let i = 0; i < 150; i++) {
      const sphereMaterial = new THREE.MeshPhongMaterial();

      const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const isGood = Math.random() > 0.5;
      if (isGood) {
        sphereMaterial.color.set(0xb4d3ef);
      } else {
        sphereMaterial.color.set(0xb0324c);
      }

      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.receiveShadow = true;
      sphere.castShadow = true;

      sphere.position.x = Math.random() - 0.5;
      sphere.position.y = Math.floor(Math.random() * 100) - 0.2;
      sphere.position.z = -0.9;
      this.add(sphere);
      this.spheres.push(sphere);
    }
  }

  async load() {
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    const light = new THREE.DirectionalLight(0xffffff, 0.6);
    light.position.set(1.4, 3.6, 8);

    this.add(ambient);
    this.add(light);

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

    light.shadow.camera.position.copy(light.position);
    light.shadow.camera.lookAt(this.player.position);
    this.add(light.shadow.camera);

    this.fog = new THREE.FogExp2(this.fogColor, this.density);
    this.plane.receiveShadow = true;

    this.plane.position.y = 0;
    this.plane.position.z = -1;

    this.player.position.y = 1.2;
    this.player.position.z = -0.8;
    this.player.rotation.x = -90;
    this.player.rotation.y = 0;
    this.player.rotation.z = 0;
    this.player.castShadow = true; //default is false
    this.player.receiveShadow = true; //default

    this.add(this.player);
    this.add(this.plane);
  }

  initialize() {
    const canvas = document.querySelector("canvas");

    canvas!.addEventListener("mousemove", this.onMouseMove.bind(this));
    canvas!.addEventListener("touchmove", this.onTouchMove.bind(this));

    this.generateSpheres();
  }

  private onMouseMove(event: MouseEvent) {
    if (this.player.position.x >= -0.6 && this.player.position.x <= 0.6) {
      const canvas = document.querySelector("canvas");
      const x = event.clientX / canvas!.clientWidth;
      this.player.position.x = x * 2 - 1;
    } else {
      this.player.position.x = this.player.position.x > 0 ? 0.6 : -0.6;
    }
  }

  private onTouchMove(event: TouchEvent) {
    if (this.player.position.x >= -0.4 && this.player.position.x <= 0.4) {
      const canvas = document.querySelector("canvas");
      const x = event.touches[0].clientX / canvas!.clientWidth;
      this.player.position.x = (x * 2 - 1) * 2;
    } else {
      this.player.position.x = this.player.position.x > 0 ? 0.4 : -0.4;
    }
  }

  update() {
    this.updateSphereLocation();

    this.handlePLayerSphereCollision();

    document.querySelector(".scores-count")!.innerHTML = this.scores.toString();
  }

  private updateSphereLocation() {
    this.spheres.forEach((sphere) => {
      sphere.position.y -= 0.025;
    });
  }

  private handlePLayerSphereCollision() {
    this.spheres.forEach((sphere) => {
      if (sphere.position.y < -0.5) {
        sphere.position.y = 100;
      }

      if (
        sphere.position.y < this.player.position.y + 0.5 &&
        sphere.position.y > this.player.position.y - 0.5 &&
        sphere.position.x < this.player.position.x + 0.2 &&
        sphere.position.x > this.player.position.x - 0.2
      ) {
        sphere.position.y = 100;

        if ((sphere.material as any).color.getHex() == 0xb0324c) {
          this.scores -= 1;
          this.player.material.color.set(0xb0324c);
        }
        if ((sphere.material as any).color.getHex() == 0xb4d3ef) {
          this.scores += 1;
          this.player.material.color.set(0xb4d3ef);
        }
      }
    });
  }

  hide() {}
}
