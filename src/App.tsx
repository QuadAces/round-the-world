import {
    CameraControls,
    Float,
    OrthographicCamera,
    Stage,
    useGLTF,
} from "@react-three/drei";
import "./styles.css";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";

import { useSpring, animated } from "@react-spring/three";
import { useRef, useState } from "react";
import * as THREE from "three";
import "@react-three/fiber";
import earthImg from "./My1nT.jpg";
import faceOne from "./inverted-dice-1.svg";
import faceTwo from "./inverted-dice-2.svg";
import faceThree from "./inverted-dice-3.svg";
import faceFour from "./inverted-dice-4.svg";
import faceFive from "./inverted-dice-5.svg";
import faceSix from "./inverted-dice-6.svg";
import { SimplexNoise } from "three/examples/jsm/Addons.js";

export function CanvasPlane() {
  const [phase, setPhase] = useState(0);
  const text = [
    "A round (the) world",
    "A holy doughnut",
    "A gimicky birthday cake",
    "A lucky dice",
    "A sharp glass shard that brings us back to",
  ] 
    const boxRef = useRef<THREE.Mesh>(null);
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterials = [ 
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(faceOne) }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(faceTwo) }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(faceThree) }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(faceFour) }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(faceFive) }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(faceSix) }),
    ]
    const sphereRef = useRef<THREE.Mesh>(null);
    const sphereGeometry = new THREE.SphereGeometry(1, 32);
    const sphereTexture = useLoader(THREE.TextureLoader, earthImg);

    const torusRef = useRef<THREE.Mesh>(null);
    const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100)
        .rotateX(Math.PI / 2)
        .translate(0, -1, 0);
    const { nodes, materials } = useGLTF(
        "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/donut-sprinkles/model.gltf"
    );

    const cylinderRef = useRef<THREE.Mesh>(null);
    const { nodes: candleNodes, materials: candleMaterials } = useGLTF(
        "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/candle/model.gltf"
    );
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
    const octahedronRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        sphereRef.current!.rotation.y += 0.01;
        torusRef.current!.rotation.y -= 0.01;
        octahedronRef.current!.rotation.y += 0.01;
        octahedronRef.current!.rotation.x += 0.01;
        octahedronRef.current!.rotation.z += 0.01;
    });

    const { position: spherePosition, scale: sphereScale } = useSpring({
        position: phase === 0 ? [0, 1, 0] : [0, -1, 0],
        scale:
            phase === 0 ? [1, 1, 1] : phase === 1 ? [0.5, 0.5, 0.5] : [0, 0, 0],
        config: { duration: 500 },
    });
    const { scale: tarusScale } = useSpring({
        scale: phase === 1 || phase === 2 ? [14, 14, 14] : [0, 0, 0],
    });
    const { scale: cylinderScale } = useSpring({
        scale: phase === 2 ? [3, 5, 3] : [0, 0, 0],
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
        <>
            <CameraControls />
            {/* @ts-ignore */}
            <Stage
                // shadows={false}
                // controls={ref}
                adjustCamera
                preset="rembrandt"
                intensity={1}
            >
                <ambientLight intensity={10} />

                <animated.mesh
                    geometry={sphereGeometry}
                    ref={sphereRef}
                    //@ts-ignore
                    scale={sphereScale}
                    //@ts-ignore
                    position={spherePosition}
                    onClick={(e) => {
                        e.stopPropagation();
                        setPhase(1);
                    }}
                >
                    {/* @ts-ignore */}
                    <meshBasicMaterial
                        attach="material"
                        map={sphereTexture}
                        toneMapped={false}
                    />
                </animated.mesh>

                <animated.group
                    ref={torusRef}
                    position={[0, -1.5, 0]}
                    scale={tarusScale}
                    onClick={(e) => {
                        e.stopPropagation();
                        setPhase(2);
                    }}
                >
                    <mesh
                        geometry={nodes.Mesh_donutSprinkles.geometry}
                        material={materials.brownLight}
                    />
                    <mesh
                        geometry={nodes.Mesh_donutSprinkles_1.geometry}
                        material={materials.purpleLight}
                    />
                    <mesh
                        geometry={nodes.Mesh_donutSprinkles_2.geometry}
                        material={materials.orange}
                    />
                    <mesh
                        geometry={nodes.Mesh_donutSprinkles_3.geometry}
                        material={materials.yellow}
                    />
                    <mesh
                        geometry={nodes.Mesh_donutSprinkles_4.geometry}
                        material={materials.green}
                    />
                </animated.group>
                {/* <animated.mesh
                    onClick={(e) => {
                      e.stopPropagation()
                      setPhase(3)}}
                    ref={cylinderRef}
                    //@ts-ignore
                    scale={cylinderScale}
                    geometry={cylinderGeometry}
                >
                    {/* @ts-ignore */}
                {/* <meshPhongMaterial attach="material" color="red" />
                </animated.mesh> */}
                <animated.group
                position={[0, -1.5, 0]}
                    ref={cylinderRef}
                    scale={cylinderScale}
                    onClick={(e) => {
                        e.stopPropagation();
                        setPhase(3);
                    }}
                >
                    <mesh
                        geometry={candleNodes.Cylinder061.geometry}
                        material={candleMaterials["White.001"]}
                    />
                    <mesh
                        geometry={candleNodes.Cylinder061_1.geometry}
                        material={candleMaterials["Black.002"]}
                    />
                    <mesh
                        geometry={candleNodes.Cylinder061_2.geometry}
                        material={candleMaterials["Yellow.001"]}
                    />
                </animated.group>
                <animated.mesh
                    //@ts-ignore
                    scale={squareScale}
                    ref={boxRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        setPhase(4);
                        setTimeout(() => {
                          setPhase(5);
                          setTimeout(() => {
                            setPhase(6);
                        }, 100);
                      }, 500);

                    }}
                    geometry={boxGeometry}
                    material={boxMaterials}
                >
                    {/* @ts-ignore */}
                    {/* <meshFaceMaterial attach="material" color="red" /> */}
                </animated.mesh>
                <animated.mesh
                    geometry={topTrianglegeometry}
                    onClick={(e) => {
                        e.stopPropagation();
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
                    ref={octahedronRef}
                    //@ts-ignore
                    scale={octahedronScale}
                    onClick={(e) => {
                        e.stopPropagation();
                        setPhase(0);
                    }}
                >
                    {/* @ts-ignore */}
                    <meshBasicMaterial transparent={true} opacity={0.6} attach="material" color="#3f7b9d" />
                </animated.mesh>
            </Stage>
        </>
    );
}

export default function App() {
    return (
        <Canvas>
            <CanvasPlane />
        </Canvas>
    );
}
