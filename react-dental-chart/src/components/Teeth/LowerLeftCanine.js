// src/components/Teeth/LowerLeftCanine.tsx
import { useGLTF } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ToothInformation from '../ToothInformation';
import MiniMouth from '../Util/MiniMouth';

const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(() => {
        // Enable OrbitControls for zoom/rotation
        const controls = new OrbitControls(camera, gl.domElement);
        controls.minDistance = 3;
        controls.maxDistance = 4;
        return () => controls.dispose();
    }, [camera, gl]);
    return null;
};

const LeftLowerCanine = ({ ...props }) => {
    const group = useRef();
    const { nodes, materials } = useGLTF('/assets/Left_Lower_Canine.glb');


    const P = 'Human_Teeth_Lower_Canine002_'
    return (
        <group ref={group} {...props} dispose={null}>
            <group position={[0, -1.54, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.68}>
                {Array.from({ length: 31 }, (_, i) => {
                    const index = i + 1;
                    const geometryName =
                        index === 3
                            ? 'Human_Teeth_Lower_Canine002_3'
                            : `Human_Teeth_Lower_Canine002_${index}`;
                    return (
                        nodes[geometryName] && materials[`${i}`] && (
                            <mesh
                                key={index}
                                geometry={nodes[geometryName].geometry}
                                material={materials[`${i}`]}
                            />
                        )
                    );
                })}
            </group>
        </group>
    );
};
export const LowerLeftCanine = () => {
    const toothNumber = 33;
    return (
        <>
            <div
                style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}
            >
                {/* Back button header */}
                <div style={{ position: 'relative', width: '100%', height: '10vh' }}>
                    <img
                        src="../assets/back_arrow.png"
                        alt="Back"
                        onClick={() => (window.location.href = '/')}
                        className="back-button"
                    />
                </div>

                {/* Main 3D canvas */}
                <Canvas style={{ width: '100%', height: '80%' }}>
                    <CameraController />
                    <ambientLight intensity={0.7} />
                    <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]} />
                    <Suspense fallback={null}>
                        <LeftLowerCanine />
                    </Suspense>
                </Canvas>

                {/* Mini mouth preview window */}
                <div
                    style={{
                        position: 'absolute',
                        right: -10,
                        top: '8vh',
                        width: 120,
                        height: 120,
                        background: 'rgba(240, 248, 255, 0.4)',
                        borderRadius: 10,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        padding: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(2px)',
                        zIndex: 1000,
                        pointerEvents: 'none',
                    }}
                >
                    <MiniMouth targetToothNumber={toothNumber} />
                </div>
            </div>

            {/* Display detailed tooth information */}
            <ToothInformation toothNumber={toothNumber} />
        </>
    );
};
