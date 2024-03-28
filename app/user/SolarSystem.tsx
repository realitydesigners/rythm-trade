"use client";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Center, Line, Sphere, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import * as THREE from "three";

const SolarSystem: React.FC<{ favoritePairs: string[] }> = ({
    favoritePairs,
}) => (
    <Canvas>
        <OrbitControls
            dampingFactor={0.25}
            rotateSpeed={0.5}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
        />
        <PerspectiveCamera
            makeDefault
            position={[3, 3, 3]}
            rotation={[10, 10, 10]}
        />
        <FavoritePlanets favoritePairs={favoritePairs} />
    </Canvas>
);

const FavoritePlanetItem: React.FC<{
    position: Vector3;
    label: string;
    index: number;
}> = ({ position, label, index }) => {
    const [rotationAngle, setRotationAngle] = useState(0);
    const textRef = useRef<THREE.Object3D | null>(null);
    const { camera } = useThree();

    useFrame(() => {
        if (textRef.current) {
            textRef.current.lookAt(camera.position);
        }
    });

    useEffect(() => {
        const randomAngle = Math.random() * 2 * Math.PI;
        setRotationAngle(randomAngle);
    }, []);

    const scale = 1.5 ** index;
    const circlePoints: Vector3[] = [];
    const segments = 64;

    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = Math.cos(theta) * scale;
        const z = Math.sin(theta) * scale;
        circlePoints.push(new Vector3(x, 0, z));
    }

    const formattedLabel = label.substring(0, 7).replace(/_/g, "");

    return (
        <group position={position} rotation={[0, rotationAngle, 0]}>
            <Line
                points={circlePoints}
                color="#555"
                dashed
                dashSize={1}
                dashScale={50}
            />
            <group position={[1 * scale, 0, 0]}>
                <Sphere args={[0.1, 16, 16]}>
                    <meshBasicMaterial attach="material" color="white" />
                </Sphere>
                <Text
                    ref={textRef}
                    position={[0, 0.2, 0]}
                    color="white"
                    fontSize={0.1}
                    maxWidth={1}
                    font={"/Monomaniac.ttf"}
                    lineHeight={1}
                    letterSpacing={0.02}
                    textAlign="left"
                >
                    {formattedLabel}
                </Text>
            </group>
        </group>
    );
};

const FavoritePlanets: React.FC<{ favoritePairs: string[] }> = ({
    favoritePairs,
}) => (
    <group>
        {favoritePairs.map((pair: string, index: number) => (
            <FavoritePlanetItem
                key={pair}
                position={new Vector3(0, 0, 0)}
                label={pair}
                index={index}
            />
        ))}
    </group>
);

export default SolarSystem;
