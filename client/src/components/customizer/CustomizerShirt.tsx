import React, { useRef, useState, useEffect } from 'react';
import { useGLTF, Decal } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCustomizerStore } from '../../store/customizerStore';
import { animate } from 'framer-motion';

const MODEL_PATH = '/models/shirt_baked.glb';

export const CustomizerShirt: React.FC = () => {
  const { nodes, materials } = useGLTF(MODEL_PATH) as unknown as {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.MeshStandardMaterial>;
  };

  const groupRef = useRef<THREE.Group>(null);

  // Read customizer state
  const shirtColor = useCustomizerStore((s) => s.shirtColor);
  const currentView = useCustomizerStore((s) => s.currentView);
  const frontDesign = useCustomizerStore((s) => s.frontDesign);
  const backDesign = useCustomizerStore((s) => s.backDesign);
  const setDesignPosition = useCustomizerStore((s) => s.setDesignPosition);
  const isDragging = useCustomizerStore((s) => s.isDragging);
  const setIsDragging = useCustomizerStore((s) => s.setIsDragging);

  // Directly drag design calculations
  const updatePosition = (e: any) => {
    if (!groupRef.current) return;
    const localPoint = groupRef.current.worldToLocal(e.point.clone());
    // Clamp the layout offset to matching [-0.2, 0.2] slider range
    const clampedX = Math.max(-0.2, Math.min(0.2, localPoint.x));
    const clampedY = Math.max(-0.2, Math.min(0.2, localPoint.y - 0.04));
    setDesignPosition(clampedX, clampedY);
  };

  const handlePointerDown = (e: any) => {
    const state = useCustomizerStore.getState();
    const activeDesign = state.currentView === 'front' ? state.frontDesign : state.backDesign;
    const activeLayer = activeDesign.layers.find((l) => l.id === activeDesign.activeLayerId);
    if (!activeLayer || !activeLayer.url) return;

    e.stopPropagation();
    setIsDragging(true);
    updatePosition(e);
  };

  const handlePointerMove = (e: any) => {
    if (isDragging) {
      e.stopPropagation();
      updatePosition(e);
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const currentShirtRotationY = useRef(0);

  // Smooth Y-rotation transition when active view changes
  useEffect(() => {
    const targetRotation = currentView === 'front' ? 0 : Math.PI;

    const controls = animate(currentShirtRotationY.current, targetRotation, {
      duration: 0.75, // Smooth animation between 600-800ms
      ease: [0.4, 0, 0.2, 1], // Ease in out cubic
      onUpdate: (latest) => {
        currentShirtRotationY.current = latest;
      },
    });

    return () => controls.stop();
  }, [currentView]);

  // Floating + breathing + Y-rotation animation
  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    // Apply the animated Y rotation
    group.rotation.y = currentShirtRotationY.current;

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
      <mesh
        geometry={shirtMesh.geometry}
        castShadow
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
      >
        <meshStandardMaterial
          {...baseMaterial}
          color={shirtColor}
          roughness={0.72}
          metalness={0.04}
          envMapIntensity={0.9}
        />

        {/* Front Decal Overlays */}
        {frontDesign.layers.map((layer) => (
          <DecalOverlay
            key={layer.id}
            designUrl={layer.visible ? layer.url : null}
            scale={layer.scale}
            rotation={layer.rotation}
            posX={layer.posX}
            posY={layer.posY}
            flipX={layer.flipX}
            flipY={layer.flipY}
            opacity={layer.visible ? layer.opacity : 0}
            isBack={false}
          />
        ))}

        {/* Back Decal Overlays */}
        {backDesign.layers.map((layer) => (
          <DecalOverlay
            key={layer.id}
            designUrl={layer.visible ? layer.url : null}
            scale={layer.scale}
            rotation={layer.rotation}
            posX={layer.posX}
            posY={layer.posY}
            flipX={layer.flipX}
            flipY={layer.flipY}
            opacity={layer.visible ? layer.opacity : 0}
            isBack={true}
          />
        ))}
      </mesh>
    </group>
  );
};

interface DecalOverlayProps {
  designUrl: string | null;
  scale: number;
  rotation: number;
  posX: number;
  posY: number;
  flipX: boolean;
  flipY: boolean;
  opacity: number;
  isBack: boolean;
}

/** Decal Overlay supporting smooth cross-fade transitions, asynchronous loading, and smooth interpolation controls */
const DecalOverlay: React.FC<DecalOverlayProps> = ({
  designUrl,
  scale,
  rotation,
  posX,
  posY,
  flipX,
  flipY,
  opacity,
  isBack,
}) => {
  const [currentTexture, setCurrentTexture] = useState<THREE.Texture | null>(null);
  const [prevTexture, setPrevTexture] = useState<THREE.Texture | null>(null);

  const currentOpacity = useRef(0);
  const prevOpacity = useRef(0);
  const loadingUrl = useRef<string | null>(null);

  const matRefCurrent = useRef<THREE.MeshStandardMaterial>(null);
  const matRefPrev = useRef<THREE.MeshStandardMaterial>(null);

  // Smooth interpolation states
  const [smoothProps, setSmoothProps] = useState({
    scale,
    rotation,
    posX,
    posY,
  });

  // Track currentTexture in a mutable ref to prevent stale closures in async loader callbacks
  const currentTextureRef = useRef<THREE.Texture | null>(null);
  useEffect(() => {
    currentTextureRef.current = currentTexture;
  }, [currentTexture]);

  // Track textures and apply flips when textures or flip states change
  useEffect(() => {
    const applyFlip = (tex: THREE.Texture | null) => {
      if (!tex) return;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(flipX ? -1 : 1, flipY ? -1 : 1);
      tex.offset.set(flipX ? 1 : 0, flipY ? 1 : 0);
      tex.needsUpdate = true;
    };

    applyFlip(currentTexture);
    applyFlip(prevTexture);
  }, [currentTexture, prevTexture, flipX, flipY]);

  // Load new textures without suspending
  useEffect(() => {
    if (!designUrl) {
      const activeCurrent = currentTextureRef.current;
      if (activeCurrent) {
        setPrevTexture(activeCurrent);
        prevOpacity.current = currentOpacity.current;
      }
      setCurrentTexture(null);
      currentOpacity.current = 0;
      loadingUrl.current = null;
      return;
    }

    loadingUrl.current = designUrl;
    const loader = new THREE.TextureLoader();

    loader.load(designUrl, (loadedTexture) => {
      if (loadingUrl.current !== designUrl) return;

      loadedTexture.colorSpace = THREE.SRGBColorSpace;

      const activeCurrent = currentTextureRef.current;
      if (activeCurrent) {
        setPrevTexture(activeCurrent);
        prevOpacity.current = currentOpacity.current;
      }

      setCurrentTexture(loadedTexture);
      currentOpacity.current = 0;
    });
  }, [designUrl]);

  useFrame((_, delta) => {
    // 1. Smooth interpolation (lerping) for design control sliders
    const lerpSpeed = 12; // Controls how fast the sliders respond
    const t = 1 - Math.exp(-lerpSpeed * delta);

    const nextScale = THREE.MathUtils.lerp(smoothProps.scale, scale, t);
    const nextRotation = THREE.MathUtils.lerp(smoothProps.rotation, rotation, t);
    const nextPosX = THREE.MathUtils.lerp(smoothProps.posX, posX, t);
    const nextPosY = THREE.MathUtils.lerp(smoothProps.posY, posY, t);

    const epsilon = 0.0001;
    if (
      Math.abs(nextScale - smoothProps.scale) > epsilon ||
      Math.abs(nextRotation - smoothProps.rotation) > epsilon ||
      Math.abs(nextPosX - smoothProps.posX) > epsilon ||
      Math.abs(nextPosY - smoothProps.posY) > epsilon
    ) {
      setSmoothProps({
        scale: nextScale,
        rotation: nextRotation,
        posX: nextPosX,
        posY: nextPosY,
      });
    }

    // 2. Crossfade opacity animation
    const fadeSpeed = 6; // Controls cross-fade speed

    if (currentTexture) {
      if (currentOpacity.current < 1) {
        currentOpacity.current = Math.min(1, currentOpacity.current + delta * fadeSpeed);
      }
    } else {
      currentOpacity.current = 0;
    }

    if (prevTexture) {
      if (prevOpacity.current > 0) {
        prevOpacity.current = Math.max(0, prevOpacity.current - delta * fadeSpeed);
      } else {
        setPrevTexture(null);
      }
    }

    if (matRefCurrent.current) {
      matRefCurrent.current.opacity = currentOpacity.current * opacity;
      matRefCurrent.current.needsUpdate = true;
    }
    if (matRefPrev.current) {
      matRefPrev.current.opacity = prevOpacity.current * opacity;
      matRefPrev.current.needsUpdate = true;
    }
  });

  if (!currentTexture && !prevTexture) return null;

  const rotRad = (smoothProps.rotation * Math.PI) / 180;

  return (
    <>
      {prevTexture && (
        <Decal
          position={[smoothProps.posX, smoothProps.posY + 0.04, isBack ? -0.15 : 0.15]}
          rotation={[0, isBack ? Math.PI : 0, isBack ? -rotRad : rotRad]}
          scale={smoothProps.scale}
        >
          <meshStandardMaterial
            ref={matRefPrev}
            map={prevTexture}
            transparent
            opacity={prevOpacity.current * opacity}
            roughness={0.72}
            metalness={0.04}
            envMapIntensity={0.9}
            polygonOffset
            polygonOffsetFactor={-4}
            depthTest={true}
            depthWrite={true}
          />
        </Decal>
      )}

      {currentTexture && (
        <Decal
          position={[smoothProps.posX, smoothProps.posY + 0.04, isBack ? -0.15 : 0.15]}
          rotation={[0, isBack ? Math.PI : 0, isBack ? -rotRad : rotRad]}
          scale={smoothProps.scale}
        >
          <meshStandardMaterial
            ref={matRefCurrent}
            map={currentTexture}
            transparent
            opacity={currentOpacity.current * opacity}
            roughness={0.72}
            metalness={0.04}
            envMapIntensity={0.9}
            polygonOffset
            polygonOffsetFactor={-4}
            depthTest={true}
            depthWrite={true}
          />
        </Decal>
      )}
    </>
  );
};

useGLTF.preload(MODEL_PATH);
