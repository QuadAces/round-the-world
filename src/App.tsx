// @ts-nocheck
import "@mantine/core/styles.css";
import { CameraControls, Float, Html, Stage, useGLTF } from "@react-three/drei";
import "./styles.css";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, MantineProvider } from "@mantine/core";
import "@mantine/core/styles/ScrollArea.css";
import "@mantine/core/styles/UnstyledButton.css";
import "@mantine/core/styles/VisuallyHidden.css";
import "@mantine/core/styles/Paper.css";
import "@mantine/core/styles/Popover.css";
import "@mantine/core/styles/CloseButton.css";
import "@mantine/core/styles/Group.css";
import "@mantine/core/styles/Loader.css";
import "@mantine/core/styles/Overlay.css";
import "@mantine/core/styles/ModalBase.css";
import "@mantine/core/styles/Input.css";
import "@mantine/core/styles/InlineInput.css";
import "@mantine/core/styles/Flex.css";
import "@mantine/core/styles/FloatingIndicator.css";
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

export function CanvasPlane() {
    const [phase, setPhase] = useState(0);
    const primaryColor = "var(--mantine-color-cyan-4)";
    const secondaryColor = "var(--mantine-color-teal-4)";
    const boxRef = useRef<THREE.Mesh>(null);
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterials = [
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(faceOne),
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(faceTwo),
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(faceThree),
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(faceFour),
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(faceFive),
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(faceSix),
        }),
    ];
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
        boxRef.current!.rotation.y += 0.01;
        boxRef.current!.rotation.x += 0.02;
        boxRef.current!.rotation.z += 0.03;
        octahedronRef.current!.rotation.y -= 0.01;
        octahedronRef.current!.rotation.x -= 0.02;
        octahedronRef.current!.rotation.z -= 0.03;
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
            <Html center>
                <h1
                    style={{
                        fontFamily: "sans-serif",
                        fontWeight: "lighter",
                        width: "100vw",
                        textAlign: "center",
                        fontSize: "2rem",
                        height: "100vh",
                        paddingTop: "10vh",
                    }}
                >
                    {/* Hey if you're reading this, I really love using this datastructure as a case statement */}
                    {
                        {
                            0: (
                                <>
                                    A&nbsp;
                                    <span style={{ color: primaryColor }}>
                                        round&nbsp;
                                    </span>
                                    (the)&nbsp;
                                    <span style={{ color: secondaryColor }}>
                                        world
                                    </span>
                                </>
                            ),
                            1: (
                                <>
                                    A&nbsp;
                                    <span style={{ color: primaryColor }}>
                                        "cooked"&nbsp;
                                    </span>
                                    <span style={{ color: secondaryColor }}>
                                        blackhole
                                    </span>
                                </>
                            ),
                            2: (
                                <>
                                    A&nbsp;
                                    <span style={{ color: primaryColor }}>
                                        gimicky&nbsp;
                                    </span>
                                    <span style={{ color: secondaryColor }}>
                                        birthday cake
                                    </span>
                                </>
                            ),
                            3: (
                                <>
                                    A&nbsp;
                                    <span style={{ color: primaryColor }}>
                                        lucky&nbsp;
                                    </span>
                                    <span style={{ color: secondaryColor }}>
                                        dice
                                    </span>
                                </>
                            ),
                            6: (
                                <>
                                    A&nbsp;
                                    <span style={{ color: primaryColor }}>
                                        sharp&nbsp;
                                    </span>
                                    <span style={{ color: secondaryColor }}>
                                        glass shard
                                    </span>
                                </>
                            ),
                        }[phase]
                    }
                </h1>
            </Html>

            <Stage adjustCamera={false} preset="rembrandt" intensity={1}>
                <ambientLight intensity={10} />

                <animated.mesh
                    geometry={sphereGeometry}
                    ref={sphereRef}
                    scale={sphereScale}
                    position={spherePosition}
                    onClick={(e) => {
                        e.stopPropagation();
                        setPhase(1);
                    }}
                >
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
                        setPhase((phase) => phase + 1);
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
                ></animated.mesh>
                <animated.mesh
                    geometry={topTrianglegeometry}
                    onClick={(e) => {
                        e.stopPropagation();
                        setPhase(5);

                        setTimeout(() => {
                            setPhase(6);
                        }, 100);
                    }}
                    scale={intermittentTriangleScale}
                    position={trianglePositionY}
                >
                    <meshPhongMaterial attach="material" color="blue" />
                </animated.mesh>
                <animated.mesh
                    geometry={bottomTrianglegeometry}
                    scale={intermittentTriangleScale}
                    onClick={() => {
                        setPhase(5);
                        setTimeout(() => {
                            setPhase(6);
                        }, 100);
                    }}
                    position={reverseTrianglePositionY}
                >
                    <meshPhongMaterial attach="material" color="blue" />
                </animated.mesh>
                <animated.mesh
                    geometry={octahedronGeometry}
                    ref={octahedronRef}
                    scale={octahedronScale}
                    onClick={(e) => {
                        e.stopPropagation();
                        setPhase(0);
                    }}
                >
                    <meshStandardMaterial
                        transparent={true}
                        opacity={0.8}
                        attach="material"
                        color="#3f7b9d"
                    />
                </animated.mesh>
            </Stage>
        </>
    );
}

export default function App() {
    const [opened, { open, close }] = useDisclosure(true);
    return (
        <>
            <MantineProvider>
                <Modal
                    opened={opened}
                    onClose={close}
                    title="Welcome 'around the world!'"
                >
                    So I've made this as an entry portfolio to UNSW's
                    devsoc.&nbsp; The theme is{" "}
                    <span style={{ color: "var(--mantine-color-cyan-4)" }}>
                        "Around THE World"&nbsp;
                    </span>
                    - and I suspect that everyone will be making a map about
                    where they've travelled and been.
                    <br /> <br />I wanted to do something a bit more unique, so
                    I took the prompt as &nbsp;
                    <span style={{ color: "var(--mantine-color-teal-4)" }}>
                        "A Round World"&nbsp;
                    </span>
                    (yes, the Earth is NOT flat!), and just switch up and tween
                    some 3D models!
                    <br />
                    Enjoy!
                    <br />
                    <br />
                    Stuart 😎 (https://github.com/QuadAces)
                </Modal>
                <Canvas style={{ width: "100vw", height: "100vh", zIndex: 0 }}>
                    <CameraControls />
                    <CanvasPlane />
                </Canvas>
            </MantineProvider>
        </>
    );
}
