import React, { useRef } from 'react';
import { useGLTF, useTexture, Decal } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCustomizerStore } from '../../store/customizerStore';

const MODEL_PATH = '/models/shirt_baked.glb';

export const CustomizerShirt: React.FC = () => {
  const { nodes, materials } = useGLTF(MODEL_PATH) as unknown as {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.MeshStandardMaterial>;
  };

  const groupRef = useRef<THREE.Group>(null);

  // Read customizer state
  const shirtColor = useCustomizerStore((s) => s.shirtColor);
  const uploadedDesign = useCustomizerStore((s) => s.uploadedDesign);
  const designScale = useCustomizerStore((s) => s.designScale);
  const designRotation = useCustomizerStore((s) => s.designRotation);
  const designPositionX = useCustomizerStore((s) => s.designPositionX);
  const designPositionY = useCustomizerStore((s) => s.designPositionY);

  // Floating + breathing animation
  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const t = performance.now() * 0.001;
    group.position.y = Math.sin(t * 0.8) * 0.012;
    const breath = 1 + Math.sin(t * 1.2) * 0.006;
    group.scale.setScalar(breath);
  });

  // Find the shirt mesh
  const shirtMesh = Object.values(nodes).find(
    (node) => node.isMesh
  ) as THREE.Mesh | undefined;

  if (!shirtMesh) return null;

  const baseMaterial = Object.values(materials)[0];

  return (
    <group ref={groupRef}>
      <mesh geometry={shirtMesh.geometry} castShadow receiveShadow>
        <meshStandardMaterial
          {...baseMaterial}
          color={shirtColor}
          roughness={0.72}
          metalness={0.04}
          envMapIntensity={0.9}
        />

        {/* Render decal if a design is uploaded */}
        {uploadedDesign && (
          <DecalOverlay
            designUrl={uploadedDesign}
            scale={designScale}
            rotation={designRotation}
            posX={designPositionX}
            posY={designPositionY}
          />
        )}
      </mesh>
    </group>
  );
};

/** Isolated decal component so useTexture only runs when a design exists */
const DecalOverlay: React.FC<{
  designUrl: string;
  scale: number;
  rotation: number;
  posX: number;
  posY: number;
}> = ({ designUrl, scale, rotation, posX, posY }) => {
  const texture = useTexture(designUrl);
  const rotRad = (rotation * Math.PI) / 180;

  return (
    <Decal
      position={[posX, posY + 0.04, 0.15]}
      rotation={[0, 0, rotRad]}
      scale={scale}
      map={texture}
      depthTest={true}
    />
  );
};

useGLTF.preload(MODEL_PATH);
