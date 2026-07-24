import React, { Suspense, useRef, useLayoutEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  AccumulativeShadows,
  RandomizedLight,
} from '@react-three/drei';
import * as THREE from 'three';
import { CustomizerShirt } from './CustomizerShirt';
import { Loader } from '../common/Loader';

/* ─── AutoFit ─── */
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

    group.position.set(0, 0, 0);
    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    const sizeVec = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(sizeVec);

    group.position.set(-center.x, -center.y, -center.z);

    const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);
    const perspCam = camera as THREE.PerspectiveCamera;
    const fov = (perspCam.fov || 45) * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
    cameraZ *= 1.35;

    const aspect = size.width / size.height;
    if (aspect < 1) cameraZ /= aspect;

    camera.position.set(0, 0, cameraZ);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    onLayoutComputed?.(sizeVec);
  }, [children, camera, size, onLayoutComputed]);

  return <group ref={groupRef}>{children}</group>;
};

/* ─── Scene content ─── */
const SceneContent: React.FC<{ onShadowY: (y: number) => void }> = ({ onShadowY }) => (
  <Suspense fallback={null}>
    <AutoFit onLayoutComputed={(sizeVec) => onShadowY(-sizeVec.y / 2 - 0.05)}>
      <CustomizerShirt />
    </AutoFit>
    <Environment preset="studio" environmentIntensity={0.5} />
  </Suspense>
);

/* ─── Loading fallback ─── */
const CanvasLoader: React.FC = () => (
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 select-none">
    <Loader variant="pulse-ring" size="md" themeColor="marvel" />
    <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-text-secondary/60">
      Loading 3D Model…
    </span>
  </div>
);

/* ─── Main Canvas ─── */
export const CustomizerCanvas: React.FC = () => {
  const [shadowY, setShadowY] = useState(-0.85);

  return (
    <div className="w-full h-full relative">
      <Suspense fallback={<CanvasLoader />}>
        <Canvas
          shadows
          camera={{ position: [0, 0, 2.2], fov: 42 }}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          className="w-full h-full"
          style={{ background: 'transparent' }}
        >
          {/* Ambient fill */}
          <ambientLight intensity={0.35} color="#e8e8f0" />

          {/* Key light (warm, top-right) */}
          <directionalLight
            position={[4, 6, 4]}
            intensity={1.6}
            color="#fff5ee"
            castShadow
            shadow-mapSize={1024}
            shadow-bias={-0.0001}
          />

          {/* Rim light (cool blue, back-left) */}
          <directionalLight
            position={[-4, 3, -3]}
            intensity={0.7}
            color="#4488ff"
          />

          {/* Red accent */}
          <pointLight position={[2.5, 0, 2]} intensity={0.5} color="#e50914" distance={6} decay={2} />

          {/* Blue fill */}
          <pointLight position={[-2.5, -0.5, -1]} intensity={0.3} color="#0476f2" distance={5} decay={2} />

          <SceneContent onShadowY={setShadowY} />

          <AccumulativeShadows
            position={[0, shadowY, 0]}
            temporal
            frames={60}
            alphaTest={0.7}
            scale={6}
            color="#000000"
            opacity={0.6}
          >
            <RandomizedLight amount={4} radius={6} ambient={0.5} position={[4, 6, 4]} bias={0.001} />
          </AccumulativeShadows>

          <ContactShadows
            position={[0, shadowY, 0]}
            opacity={0.45}
            scale={5}
            blur={2.5}
            far={0.8}
            color="#000000"
          />

          <OrbitControls
            enableZoom={true}
            enableRotate={true}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.04}
            minDistance={1.2}
            maxDistance={3.2}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.6}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};
export default CustomizerCanvas;
