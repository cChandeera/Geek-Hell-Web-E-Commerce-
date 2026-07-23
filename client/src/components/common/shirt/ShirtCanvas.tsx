import React, { Suspense, useRef, useLayoutEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ShirtModel } from './ShirtModel';

interface AutoFitProps {
  children: React.ReactNode;
  onLayoutComputed?: (size: THREE.Vector3) => void;
}

const AutoFit: React.FC<AutoFitProps> = ({ children, onLayoutComputed }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // Reset translation to compute accurate initial bounds
    group.position.set(0, 0, 0);

    // Calculate visual bounding box of loaded children
    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    const sizeVec = new THREE.Vector3();
    
    box.getCenter(center);
    box.getSize(sizeVec);

    // Center the group container visually at (0,0,0)
    group.position.set(-center.x, -center.y, -center.z);

    // Calculate camera distance to accommodate model size within FOV
    const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const fov = (perspectiveCamera.fov || 45) * (Math.PI / 180);
    
    // Default perspective fit calculation
    let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));

    // Apply safe viewport rendering margins (30% padding)
    cameraZ *= 1.3;

    // Adjust camera for mobile screen layouts (vertical viewports where aspect < 1)
    const aspect = size.width / size.height;
    if (aspect < 1) {
      cameraZ = cameraZ / aspect;
    }

    // Set camera focal parameters
    camera.position.set(0, 0, cameraZ);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    // Trigger shadow positioning updates
    if (onLayoutComputed) {
      onLayoutComputed(sizeVec);
    }
  }, [children, camera, size, onLayoutComputed]);

  return <group ref={groupRef}>{children}</group>;
};

export const ShirtCanvas: React.FC = () => {
  const [shadowY, setShadowY] = useState(-0.85);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 2.2], fov: 45 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      className="w-full h-full"
    >
      {/* Lights */}
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[5, 10, 3]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize={1024}
      />

      {/* Model Loader wrap */}
      <Suspense fallback={null}>
        <AutoFit onLayoutComputed={(sizeVec) => setShadowY(-sizeVec.y / 2 - 0.05)}>
          <ShirtModel />
        </AutoFit>
        <Environment preset="studio" />
      </Suspense>

      {/* Dynamic shadows positioned relative to the calculated bottom of the model */}
      <ContactShadows
        position={[0, shadowY, 0]}
        opacity={0.6}
        scale={8}
        blur={2.4}
        far={0.9}
      />

      {/* Navigation Controls */}
      <OrbitControls
        enableZoom={true}
        enableRotate={true}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={1.0}
        maxDistance={3.5}
      />
    </Canvas>
  );
};
export default ShirtCanvas;
