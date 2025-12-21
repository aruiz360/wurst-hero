"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Grid() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

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

    const positions: number[] = [];
    for (let i = 0; i <= 10; i++) {
      const x = -half + i * step;
      for (let j = 0; j <= 10; j++) {
        const z = -half + j * step;
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
      renderer.dispose();
      geom.dispose();
      mat.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0" />;
}
