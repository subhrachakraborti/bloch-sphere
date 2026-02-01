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
      color: 0x356aff,
      transparent: true,
      opacity: 0.15,
      shininess: 60,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.scene.add(sphere);

    const wireMat = new THREE.LineBasicMaterial({ color: 0x6fe5ff, transparent: true, opacity: 0.5 });
    const wireGeo = new THREE.WireframeGeometry(sphereGeo);
    const wire = new THREE.LineSegments(wireGeo, wireMat);
    this.scene.add(wire);

    const axisMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
    const axes = new THREE.AxesHelper(1.2);
    axes.setColors(axisMaterial.color, axisMaterial.color, axisMaterial.color);
    this.scene.add(axes);

    this.stateArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1, 0x8e75ff, 0.08, 0.06);
    this.scene.add(this.stateArrow);

    const pointGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const pointMat = new THREE.MeshStandardMaterial({ color: 0x6fe5ff, emissive: 0x6fe5ff });
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
