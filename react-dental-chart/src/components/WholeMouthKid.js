import { useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { toothData } from './ToothData';


// mock  data change this later
export const meshToToothNumber = {

    'model.001': 52,
    'model.002': 53,
    'model.003': 54,
    'model.004': 55,
    'model.005': 61,
    'model.006': 62,
    'model.007': 63,
    'model.008': 64,
    'model.009': 65,
    'model.010': 71,
    'model.011': 72,
    'model.013': 73,
    'model.014': 74,
    'model.015': 75,
    'model.016': 81,
    'model.018': 82,
    'model.019': 83,
    'model.020': 84,
    'model.023': 85,
    'model.024': 91,
    'model.026': 92,
    'model.028': 93,
    'model.030': 94,
    'model.031': 95,
    'model.032': 96,
    'model.033': 97,
    'model.034': 98,
    'model.035': 99,
};
// 材质映射
const ToothMaterials = {
    filling: new THREE.MeshStandardMaterial({ color: '#C00A0A', roughness: 0.1, metalness: 0.1 }),
    crown: new THREE.MeshStandardMaterial({ color: '#FF5100', roughness: 0.1, metalness: 0.1 }),
    bridge: new THREE.MeshStandardMaterial({ color: '#FFD500', roughness: 0.1, metalness: 0.1 }),
    implant: new THREE.MeshStandardMaterial({ color: '#007610', roughness: 0.1, metalness: 0.1 }),
    extraction: new THREE.MeshStandardMaterial({ color: '#0022FF', roughness: 0.1, metalness: 0.1, opacity: 0.6, transparent: true }),
    rootCanal: new THREE.MeshStandardMaterial({ color: '#0080FF', roughness: 0.1, metalness: 0.1 }),
    veneer: new THREE.MeshStandardMaterial({ color: '#7B00FF', roughness: 0.1, metalness: 0.1 }),
    sealant: new THREE.MeshStandardMaterial({ color: '#FF0099', roughness: 0.1, metalness: 0.1 }),
    missing: new THREE.MeshStandardMaterial({ color: 'white', opacity: 0.0, transparent: true }),
    normal: new THREE.MeshStandardMaterial({ color: '#5C5C5C', roughness: 0.1, metalness: 0.1 }),
};

// get the material
const getToothMaterial = (treatment) => {
    return ToothMaterials[treatment] || ToothMaterials.normal;
};

const WholeMouthKidModel = (props) => {
    const group = useRef();
    const { nodes } = useGLTF('/assets/version3.glb');

    // just shows mesh
    return (
        <group ref={group} {...props} dispose={null}>
            {Object.entries(nodes).map(([key, node]) => {

                if (node.type !== 'Mesh') return null;
                //const toothNumber = meshToToothNumber[key];
                const match = key.match(/\d+/);
                const toothNumber = match ? parseInt(match[0], 10) : undefined;

                const treatment = toothData[toothNumber]?.treatment || 'normal';
                console.log('mesh:', key, 'toothNumber:', toothNumber, 'treatment:', treatment);
                return (

                    <mesh
                        key={key}
                        geometry={node.geometry.clone()}
                        material={getToothMaterial(treatment)}
                        position={node.position}
                        rotation={node.rotation}
                        scale={node.scale}
                    />

                );
            })}
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