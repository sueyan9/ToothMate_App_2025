import { useGLTF } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import '../styles.css';
import { getToothPositionFromData } from './Util/getToothPositionFromData';

const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement);
        controls.minDistance = 5;
        controls.maxDistance = 6;
        controls.minPolarAngle = Math.PI / 3;
        controls.maxPolarAngle = Math.PI / 1.6;
        controls.minAzimuthAngle = -Math.PI / 4;
        controls.maxAzimuthAngle = Math.PI / 4;
        controls.rotateSpeed = 0.8;
        controls.panSpeed = 1.0;
        return () => controls.dispose();
    }, [camera, gl]);
    return null;
};

const toothMaterials = {
    filling: new THREE.MeshStandardMaterial({ color: '#C00A0A', roughness: 0.1, metalness: 0.1 }),
    crown: new THREE.MeshStandardMaterial({ color: '#FF5100', roughness: 0.1, metalness: 0.1 }),
    bridge: new THREE.MeshStandardMaterial({ color: '#FFD500', roughness: 0.1, metalness: 0.1 }),
    implant: new THREE.MeshStandardMaterial({ color: '#007610', roughness: 0.1, metalness: 0.1 }),
    extraction: new THREE.MeshStandardMaterial({ color: '#5C5C5C', roughness: 0.1, metalness: 0.1, opacity: 0.6, transparent: true }),
    rootCanal: new THREE.MeshStandardMaterial({ color: '#0080FF', roughness: 0.1, metalness: 0.1 }),
    root_canal: new THREE.MeshStandardMaterial({ color: '#0080FF', roughness: 0.1, metalness: 0.1 }),
    veneer: new THREE.MeshStandardMaterial({ color: '#7B00FF', roughness: 0.1, metalness: 0.1 }),
    sealant: new THREE.MeshStandardMaterial({ color: '#FF0099', roughness: 0.1, metalness: 0.1 }),
    missing: new THREE.MeshStandardMaterial({ color: 'white', opacity: 0.0, transparent: true }),
    normal: new THREE.MeshStandardMaterial({ color: '#5C5C5C', roughness: 0.1, metalness: 0.1 }),
};

const normalizeTreatmentType = (t) => {
    if (!t) return '';
    const map = {
        'Root Canal': 'rootCanal',
        'Crown Placement': 'crown',
        'Filling': 'filling',
        'Extraction': 'extraction',
        'Bridge': 'bridge',
        'Implant': 'implant',
        'Veneer': 'veneer',
        'Sealant': 'sealant',
        'root_canal': 'rootCanal',
        'crown': 'crown',
        'filling': 'filling',
        'extraction': 'extraction',
        'bridge': 'bridge',
        'implant': 'implant',
        'veneer': 'veneer',
        'sealant': 'sealant',
        'Cleaning': 'normal',
        'Checkup': 'normal',
    };
    const fromMap = map[t];
    return fromMap || String(t).toLowerCase();
};

const WholeMouthModel = ({
                             selectedTreatment = [],
                             activeTimePeriod,
                             treatmentsByPeriod,
                             eruptionLevels = {},
                             ...props
                         }) => {
    const group = useRef();
    const { nodes, materials } = useGLTF('/assets/adult_whole_mouth.glb');

    const listByTooth = (toothNumber) => {
        const list = activeTimePeriod === 'future'
            ? (treatmentsByPeriod?.future || [])
            : (treatmentsByPeriod?.historical || []);
        return list.filter((t) => t.toothNumber === toothNumber); // 修复字段名
    };

    const getToothMaterial = (toothNumber) => {
        const types = listByTooth(toothNumber)
            .map((t) => normalizeTreatmentType(t.treatmentType))
            .filter(Boolean);

        if (!types.length) return toothMaterials.normal;

        // 当没有选择任何过滤项时，直接用数据里的类型着色（给“拔除”留透明）
        if (!selectedTreatment || selectedTreatment.length === 0 || selectedTreatment[0] === 'none') {
            return types.includes('extraction') ? toothMaterials.missing : (toothMaterials[types[0]] || toothMaterials.normal);
        }

        const match = types.find((k) => selectedTreatment.includes(k));
        if (!match) return toothMaterials.normal;
        return match === 'extraction' ? toothMaterials.missing : (toothMaterials[match] || toothMaterials.normal);
    };

    const P = {
        upper: [0, 0.36, -0.29],
        lower: [0, 0.36, -0.07],
    };

    // 调试信息
    console.log('WholeMouthModel props:', {
        selectedTreatment,
        activeTimePeriod,
        treatmentsByPeriod
    });

    return (
        <group ref={group} {...props} dispose={null}>
            <mesh geometry={nodes.upper_jaw.geometry} material={materials.Gum} position={P.upper} rotation={[1.11, 0, 0]} scale={39.99} />
            <mesh geometry={nodes.lower_jaw.geometry} material={materials.Gum} position={P.lower} rotation={[Math.PI / 2, 0, 0]} scale={39.99} />
            <mesh geometry={nodes.tongue.geometry} material={materials.tongue} position={P.lower} rotation={[Math.PI / 2, 0, 0]} scale={39.99} />

            {/* LOWER RIGHT */}
            <mesh
                geometry={nodes.lower_right_wisdom.geometry}
                material={getToothMaterial(48)}
                position={getToothPositionFromData(48, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-right-wisdom')}
            />
            <mesh
                geometry={nodes.lower_right_second_molar.geometry}
                material={getToothMaterial(47)}
                position={getToothPositionFromData(47, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-right-second-molar')}
            />
            <mesh
                geometry={nodes.lower_right_first_molar.geometry}
                material={getToothMaterial(46)}
                position={getToothPositionFromData(46, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-right-first-molar')}
            />
            <mesh
                geometry={nodes.lower_right_second_premolar.geometry}
                material={getToothMaterial(45)}
                position={getToothPositionFromData(45, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-right-second-premolar')}
            />
            <mesh
                geometry={nodes.lower_right_first_premolar.geometry}
                material={getToothMaterial(44)}
                position={getToothPositionFromData(44, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-right-first-premolar')}
            />
            <mesh
                geometry={nodes.lower_right_canine.geometry}
                material={getToothMaterial(43)}
                position={getToothPositionFromData(43, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-right-canine')}
            />
            <mesh
                geometry={nodes.lower_right_lateral_incisor.geometry}
                material={getToothMaterial(42)}
                position={getToothPositionFromData(42, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-right-lateral-incisor')}
            />
            <mesh
                geometry={nodes.lower_right_central_incisor.geometry}
                material={getToothMaterial(41)}
                position={getToothPositionFromData(41, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-right-central-incisor')}
            />

            {/* LOWER LEFT 38–31 */}
            <mesh
                geometry={nodes.lower_left_wisdom.geometry}
                material={getToothMaterial(38)}
                position={getToothPositionFromData(38, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-left-wisdom')}
            />
            <mesh
                geometry={nodes.lower_left_second_molar.geometry}
                material={getToothMaterial(37)}
                position={getToothPositionFromData(37, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-left-second-molar')}
            />
            <mesh
                geometry={nodes.lower_left_first_molar.geometry}
                material={getToothMaterial(36)}
                position={getToothPositionFromData(36, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-left-first-molar')}
            />
            <mesh
                geometry={nodes.lower_left_second_premolar.geometry}
                material={getToothMaterial(35)}
                position={getToothPositionFromData(35, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-left-second-premolar')}
            />
            <mesh
                geometry={nodes.lower_left_first_premolar.geometry}
                material={getToothMaterial(34)}
                position={getToothPositionFromData(34, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-left-first-premolar')}
            />
            <mesh
                geometry={nodes.lower_left_canine.geometry}
                material={getToothMaterial(33)}
                position={getToothPositionFromData(33, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-left-canine')}
            />
            <mesh
                geometry={nodes.lower_left_lateral_incisor.geometry}
                material={getToothMaterial(32)}
                position={getToothPositionFromData(32, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-left-lateral-incisor')}
            />
            <mesh
                geometry={nodes.lower_left_central_incisor.geometry}
                material={getToothMaterial(31)}
                position={getToothPositionFromData(31, P.lower, eruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/lower-left-central-incisor')}
            />

            {/* UPPER RIGHT 18–11 */}
            <mesh
                geometry={nodes.upper_right_wisdom.geometry}
                material={getToothMaterial(18)}
                position={getToothPositionFromData(18, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-right-wisdom')}
            />
            <mesh
                geometry={nodes.upper_right_second_molar.geometry}
                material={getToothMaterial(17)}
                position={getToothPositionFromData(17, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-right-second-molar')}
            />
            <mesh
                geometry={nodes.upper_right_first_molar.geometry}
                material={getToothMaterial(16)}
                position={getToothPositionFromData(16, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-right-first-molar')}
            />
            <mesh
                geometry={nodes.upper_right_second_premolar.geometry}
                material={getToothMaterial(15)}
                position={getToothPositionFromData(15, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-right-second-premolar')}
            />
            <mesh
                geometry={nodes.upper_right_first_premolar.geometry}
                material={getToothMaterial(14)}
                position={getToothPositionFromData(14, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-right-first-premolar')}
            />
            <mesh
                geometry={nodes.upper_right_canine.geometry}
                material={getToothMaterial(13)}
                position={getToothPositionFromData(13, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-right-canine')}
            />
            <mesh
                geometry={nodes.upper_right_lateral_incisor.geometry}
                material={getToothMaterial(12)}
                position={getToothPositionFromData(12, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-right-lateral-incisor')}
            />
            <mesh
                geometry={nodes.upper_right_central_incisor.geometry}
                material={getToothMaterial(11)}
                position={getToothPositionFromData(11, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-right-central-incisor')}
            />

            {/* UPPER LEFT 28–21 */}
            <mesh
                geometry={nodes.upper_left_wisdom.geometry}
                material={getToothMaterial(28)}
                position={getToothPositionFromData(28, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-left-wisdom')}
            />
            <mesh
                geometry={nodes.upper_left_second_molar.geometry}
                material={getToothMaterial(27)}
                position={getToothPositionFromData(27, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-left-second-molar')}
            />
            <mesh
                geometry={nodes.upper_left_first_molar.geometry}
                material={getToothMaterial(26)}
                position={getToothPositionFromData(26, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-left-first-molar')}
            />
            <mesh
                geometry={nodes.upper_left_second_premolar.geometry}
                material={getToothMaterial(25)}
                position={getToothPositionFromData(25, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-left-second-premolar')}
            />
            <mesh
                geometry={nodes.upper_left_first_premolar.geometry}
                material={getToothMaterial(24)}
                position={getToothPositionFromData(24, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-left-first-premolar')}
            />
            <mesh
                geometry={nodes.upper_left_canine.geometry}
                material={getToothMaterial(23)}
                position={getToothPositionFromData(23, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-left-canine')}
            />
            <mesh
                geometry={nodes.upper_left_lateral_incisor.geometry}
                material={getToothMaterial(22)}
                position={getToothPositionFromData(22, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-left-lateral-incisor')}
            />
            <mesh
                geometry={nodes.upper_left_central_incisor.geometry}
                material={getToothMaterial(21)}
                position={getToothPositionFromData(21, P.upper, eruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => (window.location = '/upper-left-central-incisor')}
            />
        </group>
    );
};

export default function WholeMouth({
                                       selectedTreatment,
                                       activeTimePeriod,
                                       treatmentsByPeriod,
                                       eruptionLevels,
                                   }) {
    return (
        <div className="mouth-container">
            <Canvas camera={{ fov: 95 }}>
                <CameraController />
                <ambientLight intensity={0.7} />
                <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]} />
                <Suspense fallback={null}>
                    <WholeMouthModel
                        selectedTreatment={selectedTreatment}
                        activeTimePeriod={activeTimePeriod}
                        treatmentsByPeriod={treatmentsByPeriod}
                        eruptionLevels={eruptionLevels}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}