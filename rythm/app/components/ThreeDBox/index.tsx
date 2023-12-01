import React, { useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { BoxArrays } from '../../../types';

import * as THREE from 'three';

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

interface SingleBoxProps {
   position: [number, number, number];
   size: [number, number, number];
   color: string;
   opacity: number;
}

const SingleBox: React.FC<SingleBoxProps> = ({ position, size, color, opacity }) => (
   <mesh position={[0, 0, 0]}>
      <primitive object={new THREE.BoxGeometry(...size)} />
      <meshStandardMaterial color={color} transparent opacity={opacity} />
   </mesh>
);

interface ThreeDBoxProps {
   boxArrays: BoxArrays;
}

const ThreeDBox: React.FC<ThreeDBoxProps> = ({ boxArrays }) => {
   const boxes = useMemo(() => {
      const sortedBoxSizes = Object.keys(boxArrays)
         .map(Number)
         .sort((b, a) => boxArrays[b].rngSize - boxArrays[a].rngSize);
      return sortedBoxSizes.map((size, index) => {
         const box = boxArrays[size];

         console.log(`Box ${size}: movedUp: ${box.boxMovedUp}, size: ${box.rngSize}, index: ${index}`);

         const color = box.boxMovedUp ? 'green' : 'red';

         const boxSize: [number, number, number] = [box.rngSize - index * 0.1, box.rngSize - index * 0.1, box.rngSize - index * 0.1];

         const position: [number, number, number] = [0, 0, 0];

         const opacity = 1 - index * 0.08;

         return { position, size: boxSize, color, opacity };
      });
   }, [boxArrays]);

   return (
      <Canvas style={{ width: '100%', height: '50vh', background: '#111' }}>
         <PerspectiveCamera makeDefault position={[0.5, 0.5, 0.5]} fov={75} />
         <OrbitControls />
         <ambientLight intensity={0.5} />
         <pointLight position={[10, 10, 10]} />
         <directionalLight position={[-10, -10, -10]} intensity={0.5} />
         {boxes.map((boxProps, index) => (
            <SingleBox key={index} {...boxProps} />
         ))}
      </Canvas>
   );
};

export default ThreeDBox;
