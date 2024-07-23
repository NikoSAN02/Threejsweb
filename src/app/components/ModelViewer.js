"use client";
// components/ModelViewer.js
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Model(props) {
  const { scene } = useGLTF('/models/Deepu.glb'); // Update the path to your GLB file

  return <primitive object={scene} {...props} />;
}

const CameraPathController = ({ curve }) => {
  const { camera } = useThree();
  const scrollRef = useRef(0);
  const targetRef = useRef(new THREE.Vector3());
  const velocityRef = useRef(0);
  const dampingFactor = 0.1; // Adjust this for more damping
  const scrollSpeed = 0.0002; // Adjust the scroll speed for smoother experience

  useEffect(() => {
    const handleScroll = (event) => {
      const delta = event.deltaY * scrollSpeed;
      velocityRef.current += delta;
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, []);

  useFrame(() => {
    scrollRef.current = Math.min(Math.max(scrollRef.current + velocityRef.current, 0), 1);
    velocityRef.current *= (1 - dampingFactor); // Apply damping to velocity

    const scrollPercent = scrollRef.current;
    const point = curve.getPointAt(scrollPercent);
    
    if (point) {
      const tangent = curve.getTangentAt(scrollPercent);
      const lookAtPoint = point.clone().add(tangent);
      
      // Smoothly interpolate camera position and orientation
      camera.position.lerp(point, 0.05); // Reduce the interpolation factor for smoother transition
      targetRef.current.lerp(lookAtPoint, 0.05);
      camera.lookAt(targetRef.current);
    }
  });

  return null;
};

const ModelViewer = () => {
  const [curvePath, setCurvePath] = useState(null);

  useEffect(() => {
    const fetchCurvePath = async () => {
      try {
        const response = await fetch('/models/curvePath.json'); // Update the path to your JSON file
        const data = await response.json();

        if (Array.isArray(data.points)) {
          const points = data.points.map(p => new THREE.Vector3(p.x, p.y, p.z));
          const curve = new THREE.CatmullRomCurve3(points, data.closed);
          setCurvePath(curve);
        } else {
          console.error('Invalid path points data', data);
        }
      } catch (error) {
        console.error('Error fetching or parsing path points:', error);
      }
    };

    fetchCurvePath();
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 5, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls />
        {curvePath && <CameraPathController curve={curvePath} />}
      </Canvas>
    </div>
  );
};

export default ModelViewer;
