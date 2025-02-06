import { CameraControls } from "@react-three/drei";
import "./styles.css";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated, config } from "@react-spring/three";
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

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

    const triangleIntermittentGeometry = mergeGeometries([
        topTrianglegeometry,
        bottomTrianglegeometry,
    ]);

    const octahedronRef = useRef<THREE.Mesh>(null);
    const octahedronGeometry = new THREE.OctahedronGeometry(1).rotateY(
        Math.PI / 4
    );

    // const positionAttribute = geometry.attributes.position;
    // useLayoutEffect(() => {
    //   meshRef.current?.updateMorphTargets();
    // }, []);

    // const spherePositions = [];

    // for (let i = 0; i < positionAttribute.count; i++) {
    //   const x = positionAttribute.getX(i);
    //   const y = positionAttribute.getY(i);
    //   const z = positionAttribute.getZ(i);

    //   spherePositions.push(
    //     x * Math.sqrt(1 - (y * y) / 2 - (z * z) / 2 + (y * y * z * z) / 3),
    //     y * Math.sqrt(1 - (z * z) / 2 - (x * x) / 2 + (z * z * x * x) / 3),
    //     z * Math.sqrt(1 - (x * x) / 2 - (y * y) / 2 + (x * x * y * y) / 3)
    //   );
    // }

    // geometry.morphAttributes.position = [];
    // geometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(
    //   spherePositions,
    //   3
    // );

    // let positiveMorph = true;
    // useFrame((state, delta) => {
    //   // oscillate the morphTargetInfluences
    //   if (meshRef.current.morphTargetInfluences[0] > 1) {
    //     // meshRef.current.morphTargetInfluences[0] = 0;
    //     positiveMorph = false
    //   } else if (meshRef.current.morphTargetInfluences[0] < 0) {
    //     positiveMorph = true
    //   }
    //   if (positiveMorph) {
    //     meshRef.current.morphTargetInfluences[0] += delta
    //   } else {
    //     meshRef.current.morphTargetInfluences[0] -= delta
    //   }
    //   // meshRef.current.morphTargetInfluences[0] += delta
    //   // Math.sin(
    //   //   state.clock.elapsedTime
    //   // ) + 1
    // });
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
    const {scale: squareScale} = useSpring({
        scale: (phase === 3 || phase === 4 )? [1, 1, 1] : [0, 0, 0]
    })
    const {opacity: intermittentTriangleScale} = useSpring({opacity: (phase === 4  || phase === 5) ? [1,1,1] : [0,0,0] })
    const {position: trianglePositionY} = useSpring({position: (phase === 5) ? [0,-0.5,0] : [0, 0, 0]})
    const {position: reverseTrianglePositionY} = useSpring({position: (phase === 5) ? [0,0.5,0] : [0, 0, 0]})
    const {scale: octahedronScale} = useSpring({scale: (phase === 5 || phase === 6) ? [1,1,1] : [0,0,0]})
    return (
        <Canvas>
            <CameraControls />
            <ambientLight intensity={1} />
            <animated.mesh
                geometry={sphereGeometry}
                ref={sphereRef}
                scale={sphereScale}
                position={spherePosition}
                onClick={() => setPhase(1)}
            >
                <meshPhongMaterial attach="material" color="red" />
            </animated.mesh>
            <animated.mesh
                geometry={torusGeometry}
                scale={tarusScale}
                ref={torusRef}
                onClick={() => setPhase(2)}
            >
                <meshPhongMaterial attach="material" color="red" />
            </animated.mesh>
            <animated.mesh
            onClick={() => setPhase(3)}
                ref={cylinderRef}
                scale={cylinderScale}
                geometry={cylinderGeometry}
            >
                <meshPhongMaterial attach="material" color="red" />
            </animated.mesh>
            <animated.mesh
            scale={squareScale}
            
                ref={boxRef}
                onClick={() => setPhase(4)}
                geometry={boxGeometry}
            >
                <meshPhongMaterial attach="material" color="red" />
            </animated.mesh>
    <animated.mesh geometry={topTrianglegeometry} onClick={() => {setPhase(5)
      setTimeout(() => {
        setPhase(6)
      }, 100);
    }} scale={intermittentTriangleScale} position={trianglePositionY} >
      <meshPhongMaterial attach="material" color="blue" />
    </animated.mesh>
    <animated.mesh geometry={bottomTrianglegeometry} scale={intermittentTriangleScale} onClick={() => {setPhase(5)
      setTimeout(() => {
        setPhase(6)
      }, 100);
    }} position={reverseTrianglePositionY} >
      <meshPhongMaterial attach="material" color="blue" />
    </animated.mesh>
<animated.mesh geometry={octahedronGeometry} scale={octahedronScale} onClick={() => setPhase(0)} >
      <meshPhongMaterial attach="material" color="green" />
    </animated.mesh>
        </Canvas>
    );
}
