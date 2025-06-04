import { useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

const WholeMouthKidModel = (props) => {
    const group = useRef();

    const { nodes, materials } = useGLTF('/assets/version3.glb');

    //define ur own or change from blender
    const kidMaterial = new THREE.MeshStandardMaterial({
        color: '#fff', // default white
        roughness: 0.3,
        metalness: 0.1,
    });

    return (
        <group ref={group} {...props} dispose={null}>
            {Object.entries(nodes).map(([key, node]) =>
                node.type === 'Mesh' ? (
                    <mesh
                        key={key}
                        geometry={node.geometry}
                        material={kidMaterial}
                        position={node.position}
                        rotation={node.rotation}
                        scale={node.scale}
                    />
                ) : null
            )}
        </group>
    );
};

export default function WholeMouthKid() {
    return (
        <div className='mouth-container'>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[0, 10, 10]} intensity={0.5} />
                <Suspense fallback={null}>
                    <WholeMouthKidModel />
                </Suspense>
                <OrbitControls
                    minDistance={2}
                    maxDistance={10}
                    maxPolarAngle={Math.PI * 0.9}
                    minPolarAngle={0}
                    enablePan={false}
                />
            </Canvas>
            <p className='mouth-instructions'>kid whole mouth teeth display</p>
        </div>
    );
}