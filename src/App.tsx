import { CameraControls } from "@react-three/drei";
import "./styles.css";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated, config } from "@react-spring/three";
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import * as THREE from "three";
import "@react-three/fiber";

export default function App() {
    const [phase, setPhase] = useState(0);
    const boxRef = useRef<THREE.Mesh>(null);
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    const sphereRef = useRef<THREE.Mesh>(null);
    const sphereGeometry = new THREE.SphereGeometry(1, 32);

    const torusRef = useRef<THREE.Mesh>(null);
    const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100)
        .rotateX(Math.PI / 2)
        .translate(0, -1, 0);

    const cylinderRef = useRef<THREE.Mesh>(null);
    const cylinderGeometry = new THREE.CylinderGeometry(
        1,
        1,
        1.5,
        32
    ).translate(0, 0, 0);

    //?for some reason, 0.7 is the correct radius for the pyrmid not 1
    const topTrianglegeometry = new THREE.ConeGeometry(0.7, 1, 4)
        .translate(0, 1, 0)
        .rotateY(Math.PI / 4);
    const bottomTrianglegeometry = new THREE.ConeGeometry(0.7, 1, 4)
        .translate(0, 1, 0)
        .rotateZ(Math.PI)
        .rotateY(Math.PI / 4);

    const octahedronGeometry = new THREE.OctahedronGeometry(1).rotateY(
        Math.PI / 4
    );

    const { position: spherePosition, scale: sphereScale } = useSpring({
        position: phase === 0 ? [0, 1, 0] : [0, -1, 0],
        scale:
            phase === 0 ? [1, 1, 1] : phase === 1 ? [0.5, 0.5, 0.5] : [0, 0, 0],
        config: { duration: 500 },
    });
    const { scale: tarusScale } = useSpring({
        scale: phase === 1 || phase === 2 ? [1, 1, 1] : [0, 0, 0],
    });
    const { scale: cylinderScale } = useSpring({
        scale: phase === 2 ? [1, 2, 1] : [0, 0, 0],
    });
    const { scale: squareScale } = useSpring({
        scale: phase === 3 || phase === 4 ? [1, 1, 1] : [0, 0, 0],
    });
    const { opacity: intermittentTriangleScale } = useSpring({
        opacity: phase === 4 || phase === 5 ? [1, 1, 1] : [0, 0, 0],
    });
    const { position: trianglePositionY } = useSpring({
        position: phase === 5 ? [0, -0.5, 0] : [0, 0, 0],
    });
    const { position: reverseTrianglePositionY } = useSpring({
        position: phase === 5 ? [0, 0.5, 0] : [0, 0, 0],
    });
    const { scale: octahedronScale } = useSpring({
        scale: phase === 5 || phase === 6 ? [1, 1, 1] : [0, 0, 0],
    });
    return (
        <Canvas>
            <CameraControls />
            {/* @ts-ignore */}
            <ambientLight intensity={1} />
            <animated.mesh
                geometry={sphereGeometry}
                ref={sphereRef}
                //@ts-ignore
                scale={sphereScale}
                //@ts-ignore
                position={spherePosition}
                onClick={() => setPhase(1)}
            >
                {/* @ts-ignore */}
                <meshPhongMaterial attach="material" color="red" />
            </animated.mesh>
            <animated.mesh
                geometry={torusGeometry}
                //@ts-ignore
                scale={tarusScale}
                ref={torusRef}
                onClick={() => setPhase(2)}
            >
                {/* @ts-ignore */}
                <meshPhongMaterial attach="material" color="red" />
            </animated.mesh>
            <animated.mesh
                onClick={() => setPhase(3)}
                ref={cylinderRef}
                //@ts-ignore
                scale={cylinderScale}
                geometry={cylinderGeometry}
            >
                {/* @ts-ignore */}
                <meshPhongMaterial attach="material" color="red" />
            </animated.mesh>
            <animated.mesh
                //@ts-ignore
                scale={squareScale}
                ref={boxRef}
                onClick={() => setPhase(4)}
                geometry={boxGeometry}
            >
                {/* @ts-ignore */}
                <meshPhongMaterial attach="material" color="red" />
            </animated.mesh>
            <animated.mesh
                geometry={topTrianglegeometry}
                onClick={() => {
                    setPhase(5);
                    setTimeout(() => {
                        setPhase(6);
                    }, 100);
                }}
                //@ts-ignore
                scale={intermittentTriangleScale}
                //@ts-ignore
                position={trianglePositionY}
            >
                {/* @ts-ignore */}
                <meshPhongMaterial attach="material" color="blue" />
            </animated.mesh>
            <animated.mesh
                geometry={bottomTrianglegeometry}
                //@ts-ignore
                scale={intermittentTriangleScale}
                onClick={() => {
                    setPhase(5);
                    setTimeout(() => {
                        setPhase(6);
                    }, 100);
                }}
                //@ts-ignore
                position={reverseTrianglePositionY}
            >
                {/* @ts-ignore */}
                <meshPhongMaterial attach="material" color="blue" />
            </animated.mesh>
            <animated.mesh
                geometry={octahedronGeometry}
                //@ts-ignore
                scale={octahedronScale}
                onClick={() => setPhase(0)}
            >
                {/* @ts-ignore */}
                <meshPhongMaterial attach="material" color="green" />
            </animated.mesh>
        </Canvas>
    );
}
