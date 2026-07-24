import React, { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const MODEL_PATH = '/models/shirt_baked.glb';

/** Clamp utility */
const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

export const ShirtModel: React.FC = () => {
  const { nodes, materials } = useGLTF(MODEL_PATH) as unknown as {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.MeshStandardMaterial>;
  };

  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();

  // Smoothed mouse target (lerped each frame)
  const mouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  // Track pointer across the viewport
  const handlePointerMove = useMemo(() => {
    return (e: PointerEvent) => {
      // Normalize to -1..1
      mouse.current.x = (e.clientX / size.width) * 2 - 1;
      mouse.current.y = -((e.clientY / size.height) * 2 - 1);
    };
  }, [size]);

  // Attach/detach global pointer listener
  React.useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [handlePointerMove]);

  // Per-frame animation loop
  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const t = performance.now() * 0.001; // seconds
    const safeDelta = Math.min(delta, 0.05); // cap delta spikes

    // --- Floating bobble (slow up/down) ---
    const floatY = Math.sin(t * 0.8) * 0.015;

    // --- Breathing scale pulse ---
    const breathScale = 1 + Math.sin(t * 1.2) * 0.008;

    // --- Slow idle rotation (2-4 deg sway) ---
    const idleRotY = Math.sin(t * 0.5) * 0.05; // ~3 degrees

    // --- Mouse-reactive tilt (lerped) ---
    const lerpSpeed = 3.0 * safeDelta;
    smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * lerpSpeed;
    smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * lerpSpeed;

    const mouseTiltX = clamp(smoothMouse.current.y * 0.08, -0.12, 0.12); // pitch
    const mouseTiltY = clamp(smoothMouse.current.x * 0.12, -0.15, 0.15); // yaw

    // Apply transforms
    group.position.y = floatY;
    group.rotation.x = mouseTiltX;
    group.rotation.y = idleRotY + mouseTiltY;
    group.scale.setScalar(breathScale);
  });

  // Find the shirt mesh
  const shirtMesh = Object.values(nodes).find(
    (node) => node.isMesh
  ) as THREE.Mesh | undefined;

  if (!shirtMesh) return null;

  const shirtMaterial = Object.values(materials)[0];

  return (
    <group ref={groupRef}>
      <mesh
        geometry={shirtMesh.geometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          {...shirtMaterial}
          color="#111118"
          roughness={0.72}
          metalness={0.04}
          envMapIntensity={0.9}
        />
      </mesh>
    </group>
  );
};

// Preload the model
useGLTF.preload(MODEL_PATH);
