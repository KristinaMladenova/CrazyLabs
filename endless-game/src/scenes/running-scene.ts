import * as THREE from "three";
import TWEEN, { Tween } from "@tweenjs/tween.js";

export default class RunningScene extends THREE.Scene {
  private geometry = new THREE.PlaneGeometry(2, 100);
  private material = new THREE.MeshPhongMaterial({ color: 0x616497 });

  public fogColor = 0xb4d3ef;
  public density = 0.2;

  startTime = 0;
  GAME_DURATION = 10;

  private plane = new THREE.Mesh(this.geometry, this.material);

  planePosition() {
    this.plane.rotation.y = 0;
    this.plane.rotation.x = 0;
  }

  private clock = new THREE.Clock();

  private playerSize = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 3);
  private playerMaterial = new THREE.MeshPhongMaterial({ color: 0x4d3d64 });
  private player = new THREE.Mesh(this.playerSize, this.playerMaterial);

  private moveLeft() {
    if (this.player.position.x !== -18) {
      const tweenLeft = new TWEEN.Tween(this.player.position)
        .to({ x: this.player.position.x - 18 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          this.player.rotation.y = -140 * (Math.PI / 180);
          if (this.player.position.x < -18) {
            this.player.position.x = -18;
          }
        })
        .onComplete(() => {
          this.player.rotation.y = 180 * (Math.PI / 180);
        });
      tweenLeft.start();
    }
  }
  private moveRight() {
    if (this.player.position.x !== 18) {
      const tweenRight = new Tween(this.player.position)
        .to({ x: this.player.position.x + 18 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          this.player.rotation.y = 140 * (Math.PI / 180);

          if (this.player.position.x >= 18) {
            this.player.position.x = 18;
          }
        })
        .onComplete(() => {
          this.player.rotation.y = 180 * (Math.PI / 180);
        });
      tweenRight.start();
    }
  }

  private spheres: THREE.Mesh[] = [];
  private sphereCount = Math.floor(Math.random() * 100) + 1;

  private generateSpheres() {
    for (let i = 0; i < this.sphereCount; i++) {
      const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);

      const sphere = new THREE.Mesh(sphereGeometry, this.material);
      sphere.receiveShadow = true;
      sphere.castShadow = true;
      sphere.position.x = Math.floor(Math.random() * 2);
      sphere.position.y = Math.floor(Math.random() * 100);
      sphere.position.z = -Math.floor(Math.random() * 2);
      this.player.rotation.x = -90;

      this.add(sphere);
      this.spheres.push(sphere);
    }
  }

  private updateSpheres(deltaTime: number) {
    for (let i = 0; i < this.spheres.length; i++) {
      const sphere = this.spheres[i];
      const speed = 1; // Change this to adjust the speed of the spheres
      sphere.position.z += speed * deltaTime;

      // Check for collision with the player
      const distance = this.player.position.distanceTo(sphere.position);
      if (distance < 1) {
        // Particle effect
        const particle = this.createParticleEffect(sphere.position);
        this.add(particle);

        // Remove the sphere from the scene and array
        this.remove(sphere);
        this.spheres.splice(i, 1);

        // Add to the score
        this.score++;
        this.updateScoreUI();

        // Display the button if the player reaches a certain score
        if (this.score >= 10) {
          this.displayButton();
        }
      }
    }
  }

  async load() {
    this.fog = new THREE.FogExp2(this.fogColor, this.density);
    this.plane.receiveShadow = true;
    this.plane.position.y = 0;
    this.plane.position.z = -1;

    this.player.position.y = 1.2;
    this.player.position.z = -0.9;
    this.player.rotation.x = -90;
    this.player.rotation.y = 0;
    this.player.rotation.z = 0;

    this.player.castShadow = true; //default is false
    this.player.receiveShadow = true; //default

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
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
    light.shadow.camera.lookAt(this.player.position);
    this.add(light.shadow.camera);

    this.add(this.player);
    this.add(this.plane);

    this.add(ambient);
    this.add(light);
  }

  initialize() {
    // ...
    const canvas = document.querySelector("canvas");
    canvas!.addEventListener("mousemove", this.onMouseMove.bind(this));

    const axesHelper = new THREE.AxesHelper(1);
    this.player.add(axesHelper);
    this.generateSpheres();
  }
  private onMouseMove(event: MouseEvent) {
    const canvas = document.querySelector("canvas");
    const canvasBounds = canvas!.getBoundingClientRect();
    const canvasCenterX = canvasBounds.left + canvasBounds.width / 1;
    const mousePositionX = event.clientX;

    const distanceFromCenter = mousePositionX - canvasCenterX;
    const playerVelocity = (distanceFromCenter / canvasBounds.width) * 1;

    this.player.position.x += playerVelocity;
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime();
    if (this.startTime !== null && elapsedTime >= this.GAME_DURATION) {
      // End the game
      console.log("Game over!");
      this.startTime = null;
      const div = document.getElementById("game-over-modal");
      div.style.display = "flex";

      this.updateSpheres();

      TWEEN.update();
    }
  }

  hide() {}
}
