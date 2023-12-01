import React, { useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { BoxArrays } from '../../../types';

import * as THREE from 'three';

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

interface SingleBoxProps {
   position: [number, number, number];
   size: [number, number, number];
   color: string;
}

const SingleBox: React.FC<SingleBoxProps> = ({ position, size, color }) => (
   <mesh position={[0, 0, 0]}>
      <primitive object={new THREE.BoxGeometry(...size)} />
      <meshStandardMaterial color={'white'} />
   </mesh>
);

interface ThreeDBoxProps {
   boxArrays: BoxArrays;
}

const ThreeDBox: React.FC<ThreeDBoxProps> = ({ boxArrays }) => {
   const boxes = useMemo(() => {
      return Object.values(boxArrays).map((box, index) => {
         const color = box.boxMovedUp ? 'rgb(91,226,186)' : 'rgb(200,100,104)';

         // Increase the size values so they are visible
         const size: [number, number, number] = [1, 1, 1]; // Example size
         const position: [number, number, number] = [index * 2, 0, 0]; // Example position

         return { position, size, color };
      });
   }, [boxArrays]);

   return (
      <Canvas style={{ width: '100vw', height: '75vh', background: '#111' }}>
         <PerspectiveCamera makeDefault position={[3, 3, 3]} zoom={1} />
         <OrbitControls />
         <ambientLight intensity={0.5} />
         <pointLight position={[10, 10, 10]} />
         {boxes.map((boxProps, index) => {
            console.log('Box props:', boxProps);
            return <SingleBox key={index} {...boxProps} />;
         })}
      </Canvas>
   );
};

export default ThreeDBox;
