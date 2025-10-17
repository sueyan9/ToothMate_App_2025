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
                             teethData = [],
                             onToothClick,
                             ...props
                         }) => {
    const group = useRef();
    const { nodes, materials } = useGLTF('/assets/adult_whole_mouth.glb');

    // 单颗/多颗强制隐藏（成人编号 11–48）
    // 示例：隐藏全部磨牙 => 16,17,18,26,27,28,36,37,38,46,47,48
    // 你也可以只隐藏一颗，比如 new Set([16])
    const qs = new URLSearchParams(window.location.search);
    const isChild =
        (qs.get('parent') === 'false') ||
        (qs.get('mode') === 'child') ||
        (qs.get('hideBack') === 'true');

// 仅儿童隐藏磨牙；成人不隐藏
    console.log('[WholeMouth] search=', window.location.search, 'isChild=', isChild);
    const CHILD_HIDE_MOLARS = [16,17,18,26,27,28,36,37,38,46,47,48];
    const HIDE_TEETH = isChild ? new Set(CHILD_HIDE_MOLARS) : new Set();
    console.log('[WholeMouth] hideCount=', HIDE_TEETH.size);

    const getToothData = (toothNumber) => {
        return teethData.find((tooth) => tooth.toothNumber === toothNumber) || {};
    };

    const listByTooth = (toothNumber) => {
        const list =
            activeTimePeriod === 'future'
                ? (treatmentsByPeriod?.future || [])
                : (treatmentsByPeriod?.historical || []);
        return list.filter((t) => t.toothNumber === toothNumber);
    };

    const getToothMaterial = (toothNumber) => {
        const toothInfo = getToothData(toothNumber);
        const types = listByTooth(toothNumber)
            .map((t) => normalizeTreatmentType(t.treatmentType))
            .filter(Boolean);
        if (!types.length) return toothMaterials.normal;

        if (!selectedTreatment || selectedTreatment.length === 0 || selectedTreatment[0] === 'none') {
            if (types.includes('extraction')) {
                return toothMaterials.extraction;
            }
            return toothMaterials.normal;
        }

        if (selectedTreatment.includes('all')) {
            return types.includes('extraction') ? toothMaterials.missing : (toothMaterials[types[0]] || toothMaterials.normal);
        }
        const match = types.find((k) => selectedTreatment.includes(k));
        if (!match) return toothMaterials.normal;
        return match === 'extraction' ? toothMaterials.missing : (toothMaterials[match] || toothMaterials.normal);
    };

    const generateEruptionLevels = () => {
        const levels = {};
        teethData.forEach((tooth) => {
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

    const combinedEruptionLevels = {
        ...eruptionLevels,
        ...generateEruptionLevels(),
    };

    const P = {
        upper: [0, 0.36, -0.29],
        lower: [0, 0.36, -0.07],
    };

    const renderTooth = (nodeKey, toothNumber, toothLabel, base) => {
        // 儿童模式：命中隐藏集合则不渲染
        if (HIDE_TEETH.has(toothNumber)) return null;

        const node = nodes?.[nodeKey];
        if (!node?.geometry) return null;

        const rot = base === 'upper' ? [1.11, 0, 0] : [Math.PI / 2, 0, 0];

        return (
            <mesh
                geometry={node.geometry}
                material={getToothMaterial(toothNumber)}
                position={getToothPositionFromData(toothNumber, P[base], combinedEruptionLevels)}
                rotation={rot}
                scale={39.99}
                onClick={() => onToothClick(toothNumber, toothLabel)}
            />
        );
    };

    return (
        <group ref={group} {...props} dispose={null}>
            <mesh geometry={nodes.upper_jaw.geometry} material={materials.Gum} position={P.upper} rotation={[1.11, 0, 0]} scale={39.99} />
            <mesh geometry={nodes.lower_jaw.geometry} material={materials.Gum} position={P.lower} rotation={[Math.PI / 2, 0, 0]} scale={39.99} />
            <mesh geometry={nodes.tongue.geometry} material={materials.tongue} position={P.lower} rotation={[Math.PI / 2, 0, 0]} scale={39.99} />

            {/* LOWER RIGHT */}
            {renderTooth('lower_right_wisdom', 48, 'lower-right-wisdom', 'lower')}
            {renderTooth('lower_right_second_molar', 47, 'lower-right-second-molar', 'lower')}
            {renderTooth('lower_right_first_molar', 46, 'lower-right-first-molar', 'lower')}
            {renderTooth('lower_right_second_premolar', 45, 'lower-right-second-premolar', 'lower')}
            {renderTooth('lower_right_first_premolar', 44, 'lower-right-first-premolar', 'lower')}
            {renderTooth('lower_right_canine', 43, 'lower-right-canine', 'lower')}
            {renderTooth('lower_right_lateral_incisor', 42, 'lower-right-lateral-incisor', 'lower')}
            {renderTooth('lower_right_central_incisor', 41, 'lower-right-central-incisor', 'lower')}

            {/* LOWER LEFT 38–31 */}
            {renderTooth('lower_left_wisdom', 38, 'lower-left-wisdom', 'lower')}
            {renderTooth('lower_left_second_molar', 37, 'lower-left-second-molar', 'lower')}
            {renderTooth('lower_left_first_molar', 36, 'lower-left-first-molar', 'lower')}
            {renderTooth('lower_left_second_premolar', 35, 'lower-left-second-premolar', 'lower')}
            {renderTooth('lower_left_first_premolar', 34, 'lower-left-first-premolar', 'lower')}
            {renderTooth('lower_left_canine', 33, 'lower-left-canine', 'lower')}
            {renderTooth('lower_left_lateral_incisor', 32, 'lower-left-lateral-incisor', 'lower')}
            {renderTooth('lower_left_central_incisor', 31, 'lower-left-central-incisor', 'lower')}

            {/* UPPER RIGHT 18–11 */}
            {renderTooth('upper_right_wisdom', 18, 'upper-right-wisdom', 'upper')}
            {renderTooth('upper_right_second_molar', 17, 'upper-right-second-molar', 'upper')}
            {renderTooth('upper_right_first_molar', 16, 'upper-right-first-molar', 'upper')}
            {renderTooth('upper_right_second_premolar', 15, 'upper-right-second-premolar', 'upper')}
            {renderTooth('upper_right_first_premolar', 14, 'upper-right-first-premolar', 'upper')}
            {renderTooth('upper_right_canine', 13, 'upper-right-canine', 'upper')}
            {renderTooth('upper_right_lateral_incisor', 12, 'upper-right-lateral-incisor', 'upper')}
            {renderTooth('upper_right_central_incisor', 11, 'upper-right-central-incisor', 'upper')}

            {/* UPPER LEFT 28–21 */}
            {renderTooth('upper_left_wisdom', 28, 'upper-left-wisdom', 'upper')}
            {renderTooth('upper_left_second_molar', 27, 'upper-left-second-molar', 'upper')}
            {renderTooth('upper_left_first_molar', 26, 'upper-left-first-molar', 'upper')}
            {renderTooth('upper_left_second_premolar', 25, 'upper-left-second-premolar', 'upper')}
            {renderTooth('upper_left_first_premolar', 24, 'upper-left-first-premolar', 'upper')}
            {renderTooth('upper_left_canine', 23, 'upper-left-canine', 'upper')}
            {renderTooth('upper_left_lateral_incisor', 22, 'upper-left-lateral-incisor', 'upper')}
            {renderTooth('upper_left_central_incisor', 21, 'upper-left-central-incisor', 'upper')}
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

    const handleToothClick = (toothNumber, toothComponent) => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');

        if (userId) {
            navigate(`/${toothComponent}?userId=${encodeURIComponent(userId)}`);
        } else {
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