"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Grid() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    type GridPointInfo = { id: string; x: number; y: number; z: number };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const grid = new THREE.GridHelper(
      100, // size
      10, // divisions
      0xffffff, // center line color
      0xffffff // grid line color
    );
    scene.add(grid);

    // Points at each grid intersection (one Points object)
    const half = 100 / 2; // size/2
    const step = 100 / 10; // size/divisions

    const pointInfos: GridPointInfo[] = [];
    const positions: number[] = [];
    for (let i = 0; i <= 10; i++) {
      const x = -half + i * step;
      for (let j = 0; j <= 10; j++) {
        const z = -half + j * step;
        pointInfos.push({
          id: `${i}-${j}`,
          x,
          y: 0,
          z,
        });
        positions.push(x, 0, z);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.9, // world units
      sizeAttenuation: true,
    });

    const dots = new THREE.Points(geom, mat);
    scene.add(dots);

    const cylinderGeom = new THREE.CylinderGeometry(1, 1, 2, 32);
    const cylinderMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      metalness: 0.9,
      roughness: 0.2,
    });
    const cylinder = new THREE.Mesh(cylinderGeom, cylinderMat);
    cylinder.position.set(0, 1, 0); // center on origin and sit on the grid
    scene.add(cylinder);

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 1;
    const pointer = new THREE.Vector2();

    const handlePointSelect = (info: GridPointInfo) => {
      // TODO: replace this with whatever callback you need.
      // Returning the info to show the shape requested by the user.
      // eslint-disable-next-line no-console
      console.log("Selected grid point", info);
      return info;
    };

    const onPointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(dots);

      if (intersects.length > 0) {
        const hitIndex = intersects[0].index ?? -1;
        const info = pointInfos[hitIndex];
        if (info) {
          handlePointSelect(info);
        }
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.dispose();
      geom.dispose();
      mat.dispose();
      cylinderGeom.dispose();
      cylinderMat.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0" />;
}
