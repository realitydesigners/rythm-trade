import React, { useMemo, useRef, RefObject } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { BoxArrays } from '../../types';
import * as THREE from 'three';
import { DirectionalLight } from 'three';
import { EffectComposer, DotScreen } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { OrbitControls, PerspectiveCamera, Center } from '@react-three/drei';

interface SingleBoxProps {
   position: [number, number, number];
   size: [number, number, number];
   color: string;
   opacity: number;
}

interface RotatingDirectionalLightProps {
   position: [number, number, number];
   color: string;
   intensity: number;
}
interface ThreeDBoxProps {
   boxArrays: BoxArrays;
}

const SingleBox: React.FC<SingleBoxProps> = ({ position, size, color, opacity }) => (
   <mesh position={[0, 0, 0]}>
      <primitive object={new THREE.BoxGeometry(...size)} />
      <meshStandardMaterial color={color} transparent opacity={opacity} emissiveIntensity={8} toneMapped={true} />
   </mesh>
);

const ThreeDBox: React.FC<ThreeDBoxProps> = ({ boxArrays }) => {
   const boxes = useMemo(() => {
      const sortedBoxSizes = Object.keys(boxArrays)
         .map(Number)
         .sort((b, a) => boxArrays[b].rngSize - boxArrays[a].rngSize);
      return sortedBoxSizes.map((size, index) => {
         const box = boxArrays[size];

         //   console.log(`Box ${size}: movedUp: ${box.boxMovedUp}, size: ${box.rngSize}, index: ${index}`);

         const colorUp = 'rgba(58, 153, 147, 0.8)';
         const colorDown = 'rgba(191, 80, 96, 0.8)';

         const color = box.boxMovedUp ? colorUp : colorDown;

         const boxSize: [number, number, number] = [box.rngSize - index * 0.1, box.rngSize - index * 0.1, box.rngSize - index * 0.1];
         const position: [number, number, number] = [0, 0, 0];
         const opacity = 1 - index * 0.075;

         return { position, size: boxSize, color, opacity };
      });
   }, [boxArrays]);

   return (
      <Canvas style={{ width: '100%', height: '80vh', background: '#000' }}>
         <PerspectiveCamera makeDefault position={[1, 1, 1]} fov={60} />
         <OrbitControls />
         {/* LIGHTING */}
         <ambientLight intensity={10} color={'rgb(150, 141, 255)'} receiveShadow={true} /> {/* Soft purple */}
         <RotatingDirectionalLight position={[0, -10, -10]} color={'rgba(58, 153, 147, 0.8)'} intensity={4} /> {/* Turquoise */}
         <RotatingDirectionalLight position={[10, 0, 10]} color={'rgb(255, 182, 193)'} intensity={4} /> {/* Light pink */}
         {/* 3D BOX */}
         <EffectComposer>
            <DotScreen blendFunction={BlendFunction.NORMAL} angle={Math.PI * 10} scale={500} />
            <Center>
               {boxes.map((boxProps, index) => (
                  <SingleBox key={index} {...boxProps} />
               ))}
            </Center>
         </EffectComposer>
      </Canvas>
   );
};

const RotatingDirectionalLight: React.FC<RotatingDirectionalLightProps> = ({ position, color, intensity }) => {
   const lightRef: RefObject<DirectionalLight> = useRef<DirectionalLight>(null);

   useFrame(() => {
      if (lightRef.current) {
         lightRef.current.position.y = Math.sin(Date.now() * 0.0003) * 20;
         lightRef.current.position.x = Math.cos(Date.now() * 0.0003) * 20;
      }
   });

   return <directionalLight ref={lightRef} position={position} color={color} intensity={intensity} />;
};

export default ThreeDBox;
