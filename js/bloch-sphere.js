/*
MIT License
Copyright (c) 2025 Subhra Chakraborti
*/
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

export class BlochSphere {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(2.6, 2.2, 2.6);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.minDistance = 2.2;
    this.controls.maxDistance = 5;

    this.sphereColor = 0x356aff;
    this.arrowColor = 0x8e75ff;
    this.pointColor = 0x6fe5ff;

    this.createScene();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  createScene() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(4, 4, 4);
    this.scene.add(ambient, directional);

    const sphereGeo = new THREE.SphereGeometry(1, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: this.sphereColor,
      transparent: true,
      opacity: 0.15,
      shininess: 60,
    });
    this.sphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.scene.add(this.sphere);

    const wireMat = new THREE.LineBasicMaterial({ color: 0x6fe5ff, transparent: true, opacity: 0.5 });
    const wireGeo = new THREE.WireframeGeometry(sphereGeo);
    const wire = new THREE.LineSegments(wireGeo, wireMat);
    this.scene.add(wire);

    const axisMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
    const axes = new THREE.AxesHelper(1.2);
    axes.setColors(axisMaterial.color, axisMaterial.color, axisMaterial.color);
    this.scene.add(axes);

    this.stateArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      1,
      this.arrowColor,
      0.08,
      0.06
    );
    this.scene.add(this.stateArrow);

    const pointGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const pointMat = new THREE.MeshStandardMaterial({ color: this.pointColor, emissive: this.pointColor });
    this.statePoint = new THREE.Mesh(pointGeo, pointMat);
    this.scene.add(this.statePoint);
  }

  updateFromAngles(theta, phi) {
    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);
    const direction = new THREE.Vector3(x, z, y).normalize();
    this.stateArrow.setDirection(direction);
    this.statePoint.position.copy(direction);
  }

  rotateAroundAxis(axis, angle) {
    const direction = this.stateArrow.getDirection(new THREE.Vector3());
    const rotationAxis = new THREE.Vector3();

    switch (axis) {
      case 'x':
        rotationAxis.set(1, 0, 0);
        break;
      case 'y':
        rotationAxis.set(0, 1, 0);
        break;
      case 'z':
        rotationAxis.set(0, 0, 1);
        break;
    }

    direction.applyAxisAngle(rotationAxis, angle);
    this.stateArrow.setDirection(direction);
    this.statePoint.position.copy(direction);

    const { theta, phi } = this.getCurrentAngles();
    return { theta, phi };
  }

  getCurrentAngles() {
    const direction = this.stateArrow.getDirection(new THREE.Vector3());
    const x = direction.x;
    const y = direction.z;
    const z = direction.y;
    const theta = Math.acos(Math.min(1, Math.max(-1, z)));
    const phi = Math.atan2(y, x);
    return { theta, phi: phi < 0 ? phi + Math.PI * 2 : phi };
  }

  reset(theta = Math.PI / 4, phi = Math.PI / 4) {
    this.updateFromAngles(theta, phi);
  }

  setSphereColor(color) {
    this.sphereColor = color;
    if (this.sphere) {
      this.sphere.material.color.setHex(parseInt(color.replace('#', ''), 16));
    }
  }

  setArrowColor(color) {
    this.arrowColor = color;
    if (this.stateArrow) {
      this.stateArrow.setColor(new THREE.Color(color));
    }
  }

  setPointColor(color) {
    this.pointColor = color;
    if (this.statePoint) {
      this.statePoint.material.color.setHex(parseInt(color.replace('#', ''), 16));
      this.statePoint.material.emissive.setHex(parseInt(color.replace('#', ''), 16));
    }
  }

  resize() {
    const { clientWidth, clientHeight } = this.canvas.parentElement;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight, false);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
