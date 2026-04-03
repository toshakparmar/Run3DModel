import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const SERVER_URL = import.meta.env.VITE_APP_URL || "http://localhost:5000";

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  
  useMemo(() => {
    if (scene) {
      // Reset first for safe recalculation
      scene.scale.set(1, 1, 1);
      scene.position.set(0, 0, 0);

      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      
      if (size > 0) {
        // Synchronously center and normalize size to eliminate jump glitches
        const scale = 4 / size;
        scene.scale.setScalar(scale);
        scene.position.sub(center.multiplyScalar(scale));
      }
    }
  }, [scene]);

  return <primitive object={scene} />;
};

const CameraController = ({ onCameraChange, initialTarget }) => {
  const { camera } = useThree();
  const controlsRef = useRef();

  const handleChange = () => {
    if (onCameraChange && controlsRef.current) {
      onCameraChange({
        position: {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z
        },
        target: {
          x: controlsRef.current.target.x,
          y: controlsRef.current.target.y,
          z: controlsRef.current.target.z
        }
      });
    }
  };

  return (
    <OrbitControls 
      ref={controlsRef} 
      onChange={handleChange} 
      makeDefault
      enableDamping
      dampingFactor={0.05}
      target={initialTarget}
    />
  );
};

export default function ThreeCanvas({ modelUrl, cameraState, onCameraSave }) {
  const fullModelUrl = `${SERVER_URL}${modelUrl}`;
  
  // Directly bind initial state on Canvas mounting
  const initPos = cameraState ? [cameraState.position.x, cameraState.position.y, cameraState.position.z] : [0, 0, 5];

  return (
    <Canvas camera={{ position: initPos, fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Environment preset="city" />
      
      <group position={[0, 0.7, 0]}>
        <Model url={fullModelUrl} />
      </group>
      
      <ContactShadows position={[0, -0.7, 0]} opacity={0.4} scale={10} blur={2} far={4} />

      <CameraController 
        onCameraChange={onCameraSave} 
        initialTarget={cameraState?.target ? [cameraState.target.x, cameraState.target.y, cameraState.target.z] : [0, 0, 0]} 
      />
    </Canvas>
  );
}
