import { useGLTF } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
    normal: new THREE.MeshStandardMaterial({ color: '#5C5C5C', roughness: 0.8, metalness: 0.1 }),
};

const normalizeTreatmentType = (t) => {
    if (!t) return '';
    const map = {
        'Root Canal': 'rootCanal',
        'root_canal': 'root_canal',
        'Crown Placement': 'crown',
        'Filling': 'filling',
        'Extraction': 'extraction',
        'Bridge': 'bridge',
        'Implant': 'implant',
        'Veneer': 'veneer',
        'Sealant': 'sealant',
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
                             teethData=[], //read tooth data from API
                             onToothClick,
                             ...props
                         }) => {
    const group = useRef();
    const { nodes, materials } = useGLTF('/assets/adult_whole_mouth.glb');

    // get toothData
    const getToothData = (toothNumber) => {
        return teethData.find(tooth => tooth.toothNumber === toothNumber) || {};
    };
    const listByTooth = (toothNumber) => {
        const list = activeTimePeriod === 'future'
            ? (treatmentsByPeriod?.future || [])
            : (treatmentsByPeriod?.historical || []);
        return list.filter((t) => t.toothNumber === toothNumber);
    };

    const getToothMaterial = (toothNumber) => {
        const toothInfo = getToothData(toothNumber);
        const types = listByTooth(toothNumber)
            .map((t) => normalizeTreatmentType(t.treatmentType))
            .filter(Boolean);
        console.log(`Tooth ${toothNumber}:`, {
            toothInfo,
            types,
            selectedTreatment,
            hasExtraction: types.includes('extraction'),
            isPartialErupted: toothInfo.partial_erupted
        });
        if (!types.length) return toothMaterials.normal;

        // Clear All Treatments
        if (!selectedTreatment || selectedTreatment.length === 0 || selectedTreatment[0] === 'none') {
            console.log(`Tooth ${toothNumber}: Clear all mode`);
            //  extraction，shows as missing（transparent）
            if (types.includes('extraction')) {
                return toothMaterials.extraction;
            }
            // the rest normal
            console.log(`Tooth ${toothNumber}: No extraction, returning normal material`);
            return toothMaterials.normal;
        }

        //  'all' ==all the color
        if (selectedTreatment.includes('all')) {
            return types.includes('extraction') ? toothMaterials.missing : (toothMaterials[types[0]] || toothMaterials.normal);
        }
        const match = types.find((k) => selectedTreatment.includes(k));
        if (!match) return toothMaterials.normal;
        return match === 'extraction' ? toothMaterials.missing : (toothMaterials[match] || toothMaterials.normal);
    };

// according the eruptionLevels to  change the position
    const generateEruptionLevels = () => {
        const levels = {};

        teethData.forEach(tooth => {
            if (tooth.partial_erupted === true) {
                levels[tooth.toothNumber] = 0.5;
            } else if (tooth.extracted === true) {
                levels[tooth.toothNumber] = 0.0;
            } else {
                levels[tooth.toothNumber] = 1.0;
            }
        });

        return levels;
    };

    // combine with eruptionLevels and get  teethData to get new levels
    const combinedEruptionLevels = {
        ...eruptionLevels,
        ...generateEruptionLevels()
    };

    const P = {
        upper: [0, 0.36, -0.29],
        lower: [0, 0.36, -0.07],
    };
    return (
        <group ref={group} {...props} dispose={null}>
            <mesh geometry={nodes.upper_jaw.geometry} material={materials.Gum} position={P.upper} rotation={[1.11, 0, 0]} scale={39.99} />
            <mesh geometry={nodes.lower_jaw.geometry} material={materials.Gum} position={P.lower} rotation={[Math.PI / 2, 0, 0]} scale={39.99} />
            <mesh geometry={nodes.tongue.geometry} material={materials.tongue} position={P.lower} rotation={[Math.PI / 2, 0, 0]} scale={39.99} />

            {/* LOWER RIGHT */}
            <mesh
                geometry={nodes.lower_right_wisdom.geometry}
                material={getToothMaterial(48)}
                position={getToothPositionFromData(48, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(48, 'lower-right-wisdom')}
            />
            <mesh
                geometry={nodes.lower_right_second_molar.geometry}
                material={getToothMaterial(47)}
                position={getToothPositionFromData(47, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(47, 'lower-right-second-molar')}
            />
            <mesh
                geometry={nodes.lower_right_first_molar.geometry}
                material={getToothMaterial(46)}
                position={getToothPositionFromData(46, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(46, 'lower-right-first-molar')}
            />
            <mesh
                geometry={nodes.lower_right_second_premolar.geometry}
                material={getToothMaterial(45)}
                position={getToothPositionFromData(45, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(45, 'lower-right-second-premolar')}
            />
            <mesh
                geometry={nodes.lower_right_first_premolar.geometry}
                material={getToothMaterial(44)}
                position={getToothPositionFromData(44, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(44, 'lower-right-first-premolar')}
            />
            <mesh
                geometry={nodes.lower_right_canine.geometry}
                material={getToothMaterial(43)}
                position={getToothPositionFromData(43, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(43, 'lower-right-canine')}
            />
            <mesh
                geometry={nodes.lower_right_lateral_incisor.geometry}
                material={getToothMaterial(42)}
                position={getToothPositionFromData(42, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(42, 'lower-right-lateral-incisor')}
            />
            <mesh
                geometry={nodes.lower_right_central_incisor.geometry}
                material={getToothMaterial(41)}
                position={getToothPositionFromData(41, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(41, 'lower-right-central-incisor')}
            />

            {/* LOWER LEFT 38–31 */}
            <mesh
                geometry={nodes.lower_left_wisdom.geometry}
                material={getToothMaterial(38)}
                position={getToothPositionFromData(38, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(38, 'lower-left-wisdom')}
            />
            <mesh
                geometry={nodes.lower_left_second_molar.geometry}
                material={getToothMaterial(37)}
                position={getToothPositionFromData(37, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(37, 'lower-left-second-molar')}
            />
            <mesh
                geometry={nodes.lower_left_first_molar.geometry}
                material={getToothMaterial(36)}
                position={getToothPositionFromData(36, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(36, 'lower-left-first-molar')}
            />
            <mesh
                geometry={nodes.lower_left_second_premolar.geometry}
                material={getToothMaterial(35)}
                position={getToothPositionFromData(35, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(35, 'lower-left-second-premolar')}
            />
            <mesh
                geometry={nodes.lower_left_first_premolar.geometry}
                material={getToothMaterial(34)}
                position={getToothPositionFromData(34, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(34, 'lower-left-first-premolar')}
            />
            <mesh
                geometry={nodes.lower_left_canine.geometry}
                material={getToothMaterial(33)}
                position={getToothPositionFromData(33, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(33, 'lower-left-canine')}
            />
            <mesh
                geometry={nodes.lower_left_lateral_incisor.geometry}
                material={getToothMaterial(32)}
                position={getToothPositionFromData(32, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(32, 'lower-left-lateral-incisor')}
            />
            <mesh
                geometry={nodes.lower_left_central_incisor.geometry}
                material={getToothMaterial(31)}
                position={getToothPositionFromData(31, P.lower, combinedEruptionLevels)}
                rotation={[Math.PI / 2, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(31, 'lower-left-central-incisor')}
            />

            {/* UPPER RIGHT 18–11 */}
            <mesh
                geometry={nodes.upper_right_wisdom.geometry}
                material={getToothMaterial(18)}
                position={getToothPositionFromData(18, P.upper,combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(18, 'upper-right-wisdom')}
            />
            <mesh
                geometry={nodes.upper_right_second_molar.geometry}
                material={getToothMaterial(17)}
                position={getToothPositionFromData(17, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(17, 'upper-right-second-molar')}
            />
            <mesh
                geometry={nodes.upper_right_first_molar.geometry}
                material={getToothMaterial(16)}
                position={getToothPositionFromData(16, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(16, 'upper-right-first-molar')}
            />
            <mesh
                geometry={nodes.upper_right_second_premolar.geometry}
                material={getToothMaterial(15)}
                position={getToothPositionFromData(15, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(15, 'upper-right-second-premolar')}
            />
            <mesh
                geometry={nodes.upper_right_first_premolar.geometry}
                material={getToothMaterial(14)}
                position={getToothPositionFromData(14, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(14, 'upper-right-first-premolar')}
            />
            <mesh
                geometry={nodes.upper_right_canine.geometry}
                material={getToothMaterial(13)}
                position={getToothPositionFromData(13, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(13, 'upper-right-canine')}
            />
            <mesh
                geometry={nodes.upper_right_lateral_incisor.geometry}
                material={getToothMaterial(12)}
                position={getToothPositionFromData(12, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(12, 'upper-right-lateral-incisor')}
            />
            <mesh
                geometry={nodes.upper_right_central_incisor.geometry}
                material={getToothMaterial(11)}
                position={getToothPositionFromData(11, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(11, 'upper-right-central-incisor')}
            />

            {/* UPPER LEFT 28–21 */}
            <mesh
                geometry={nodes.upper_left_wisdom.geometry}
                material={getToothMaterial(28)}
                position={getToothPositionFromData(28, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(28, 'upper-left-wisdom')}
            />
            <mesh
                geometry={nodes.upper_left_second_molar.geometry}
                material={getToothMaterial(27)}
                position={getToothPositionFromData(27, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(27, 'upper-left-second-molar')}
            />
            <mesh
                geometry={nodes.upper_left_first_molar.geometry}
                material={getToothMaterial(26)}
                position={getToothPositionFromData(26, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(26, 'upper-left-first-molar')}
            />
            <mesh
                geometry={nodes.upper_left_second_premolar.geometry}
                material={getToothMaterial(25)}
                position={getToothPositionFromData(25, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(25, 'upper-left-second-premolar')}
            />
            <mesh
                geometry={nodes.upper_left_first_premolar.geometry}
                material={getToothMaterial(24)}
                position={getToothPositionFromData(24, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(24, 'upper-left-first-premolar')}
            />
            <mesh
                geometry={nodes.upper_left_canine.geometry}
                material={getToothMaterial(23)}
                position={getToothPositionFromData(23, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(23, 'upper-left-canine')}
            />
            <mesh
                geometry={nodes.upper_left_lateral_incisor.geometry}
                material={getToothMaterial(22)}
                position={getToothPositionFromData(22, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(22, 'upper-left-lateral-incisor')}
            />
            <mesh
                geometry={nodes.upper_left_central_incisor.geometry}
                material={getToothMaterial(21)}
                position={getToothPositionFromData(21, P.upper, combinedEruptionLevels)}
                rotation={[1.11, 0, 0]}
                scale={39.99}
                onClick={() => onToothClick(21, 'upper-left-central-incisor')}
            />
        </group>
    );
};

export default function WholeMouth({
                                       selectedTreatment,
                                       activeTimePeriod,
                                       treatmentsByPeriod,
                                       eruptionLevels,
                                       teethData = [],
                                   }) {
    const navigate = useNavigate();

    // add the toothclick handle
    const handleToothClick = (toothNumber, toothComponent) => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');

        if (userId) {
            // React Router，keep the "userId" parameter
            navigate(`/${toothComponent}?userId=${encodeURIComponent(userId)}`);
        } else {
            console.error('No userId found for navigation');
            // without userId，
            navigate(`/${toothComponent}`);
        }
    };

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
                        teethData={teethData}
                        onToothClick={handleToothClick}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}