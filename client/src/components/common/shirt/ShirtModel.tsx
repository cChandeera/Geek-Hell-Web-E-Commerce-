import React from 'react';
import { useGLTF, Center } from '@react-three/drei';

export const ShirtModel: React.FC = () => {
  // Load the glb file from the public directory
  const { scene } = useGLTF('/models/shirt.glb');

  return (
    <Center>
      <primitive 
        object={scene} 
        castShadow 
        receiveShadow 
      />
    </Center>
  );
};

// Preload the model to optimize load times
useGLTF.preload('/models/shirt.glb');
