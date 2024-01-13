import { Center, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
	Bloom,
	DotScreen,
	EffectComposer,
	Scanline,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import React, { RefObject, useMemo, useRef } from "react";
import * as THREE from "three";
import { DirectionalLight } from "three";
import { BoxArrays } from "../../types";

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

interface BoxGroupProps {
	boxes: SingleBoxProps[];
}

const SingleBox: React.FC<SingleBoxProps> = ({
	position,
	size,
	color,
	opacity,
}) => {
	const boxRef = useRef<THREE.Mesh>(null);

	useFrame(() => {
		if (boxRef.current) {
			boxRef.current.rotation.y += 0.001;
		}
	});

	return (
		<mesh ref={boxRef} position={position}>
			<primitive object={new THREE.BoxGeometry(...size)} />
			<meshStandardMaterial
				color={color}
				transparent
				opacity={opacity}
				emissiveIntensity={8}
				toneMapped={true}
			/>
		</mesh>
	);
};

const RotatingDirectionalLight: React.FC<RotatingDirectionalLightProps> = ({
	position,
	color,
	intensity,
}) => {
	const lightRef: RefObject<DirectionalLight> = useRef<DirectionalLight>(null);

	return (
		<directionalLight
			ref={lightRef}
			position={position}
			color={color}
			intensity={intensity}
		/>
	);
};

const BoxGroup: React.FC<BoxGroupProps> = ({ boxes }) => {
	const boxesGroupRef = useRef<THREE.Group>(null);

	useFrame(() => {
		if (boxesGroupRef.current) {
			boxesGroupRef.current.rotation.y += 0.001;
		}
	});

	return (
		<group ref={boxesGroupRef}>
			{boxes.map((boxProps, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<SingleBox key={index} {...boxProps} />
			))}
		</group>
	);
};

const ThreeDBox: React.FC<ThreeDBoxProps> = ({ boxArrays }) => {
	const boxes = useMemo(() => {
		return Object.keys(boxArrays).map((key, index) => {
			const numericKey = Number(key);
			const box = boxArrays[numericKey];
			const colorUp = "#59cfc3";
			const colorDown = "#CF596E";
			const color = box.boxMovedUp ? colorUp : colorDown;
			const size: [number, number, number] = [
				box.rngSize - index * 0.1,
				box.rngSize - index * 0.1,
				box.rngSize - index * 0.1,
			];
			const position: [number, number, number] = [0, 0, 0];
			const opacity = 1 - index * 0.1;

			return { position, size, color, opacity };
		});
	}, [boxArrays]);

	return (
		<div className="w-full h-[100vh]">
			<Canvas style={{ width: "100%", height: "100%" }}>
				<PerspectiveCamera makeDefault position={[1, 0, 1]} fov={60} />
				<OrbitControls />

				<ambientLight intensity={5} color={"#fff"} receiveShadow={true} />
				<RotatingDirectionalLight
					position={[0, -10, -10]}
					color={"rgba(58, 153, 147)"}
					intensity={1}
				/>
				<RotatingDirectionalLight
					position={[10, 0, 10]}
					color={"rgb(255, 182, 193)"}
					intensity={1}
				/>

				<pointLight position={[0, 3, 0]} color={"#59cfc3"} intensity={100} />
				<pointLight position={[0, -3, 0]} color={"#CF596E"} intensity={100} />

				<Center>
					<EffectComposer>
						<Scanline blendFunction={BlendFunction.OVERLAY} density={5} />
						<BoxGroup boxes={boxes} />
					</EffectComposer>
				</Center>
			</Canvas>
		</div>
	);
};

export default ThreeDBox;