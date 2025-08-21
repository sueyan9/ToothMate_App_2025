import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useGLTF } from '@react-three/drei';
import axios from 'axios';
import { TREATMENTS } from './Treatment';
import '../styles.css';

// ================= get treatment color  =================
const getColorFromTreatment = (treatmentKey) => {
    const treatment = TREATMENTS.find(t => t.key === treatmentKey);
    return treatment ? treatment.colour : '#FFFFFF';
};

// ================= Camera Controller =================
const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement);
        controls.minDistance = 3;
        controls.maxDistance = 6;
        return () => controls.dispose();
    }, [camera, gl]);
    return null;
};

// ================= 3D tooth model =================
const WholeMouthModel = ({ teethData, filter }) => {
    const group = useRef();
    const { nodes, materials } = useGLTF('/assets/adult_whole_mouth.glb');

    // tooth list include name and locations of all teeth mesh
    const teethList = [
        // LOWER RIGHT
        { name: 'lower_right_wisdom', node: nodes.lower_right_wisdom, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        { name: 'lower_right_second_molar', node: nodes.lower_right_second_molar, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        { name: 'lower_right_first_molar', node: nodes.lower_right_first_molar, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        { name: 'lower_right_second_premolar', node: nodes.lower_right_second_premolar, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        { name: 'lower_right_first_premolar', node: nodes.lower_right_first_premolar, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        { name: 'lower_right_canine', node: nodes.lower_right_canine, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        { name: 'lower_right_lateral_incisor', node: nodes.lower_right_lateral_incisor, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        { name: 'lower_right_central_incisor', node: nodes.lower_right_central_incisor, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        // LOWER LEFT
        { name: 'lower_left_wisdom', node: nodes.lower_left_wisdom, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        { name: 'lower_left_second_molar', node: nodes.lower_left_second_molar, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        { name: 'lower_left_first_molar', node: nodes.lower_left_first_molar, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        { name: 'lower_left_second_premolar', node: nodes.lower_left_second_premolar, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        { name: 'lower_left_first_premolar', node: nodes.lower_left_first_premolar, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        { name: 'lower_left_canine', node: nodes.lower_left_canine, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        { name: 'lower_left_lateral_incisor', node: nodes.lower_left_lateral_incisor, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        { name: 'lower_left_central_incisor', node: nodes.lower_left_central_incisor, pos: [0, 0.36, -0.07], rot: [Math.PI / 2, 0, 0] },
        // UPPER RIGHT
        { name: 'upper_right_wisdom', node: nodes.upper_right_wisdom, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        { name: 'upper_right_second_molar', node: nodes.upper_right_second_molar, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        { name: 'upper_right_first_molar', node: nodes.upper_right_first_molar, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        { name: 'upper_right_second_premolar', node: nodes.upper_right_second_premolar, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        { name: 'upper_right_first_premolar', node: nodes.upper_right_first_premolar, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        { name: 'upper_right_canine', node: nodes.upper_right_canine, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        { name: 'upper_right_lateral_incisor', node: nodes.upper_right_lateral_incisor, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        { name: 'upper_right_central_incisor', node: nodes.upper_right_central_incisor, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        // UPPER LEFT
        { name: 'upper_left_wisdom', node: nodes.upper_left_wisdom, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        { name: 'upper_left_second_molar', node: nodes.upper_left_second_molar, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        { name: 'upper_left_first_molar', node: nodes.upper_left_first_molar, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        { name: 'upper_left_second_premolar', node: nodes.upper_left_second_premolar, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        { name: 'upper_left_first_premolar', node: nodes.upper_left_first_premolar, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        { name: 'upper_left_canine', node: nodes.upper_left_canine, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        { name: 'upper_left_lateral_incisor', node: nodes.upper_left_lateral_incisor, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
        { name: 'upper_left_central_incisor', node: nodes.upper_left_central_incisor, pos: [0, 0.36, -0.29], rot: [1.11, 0, 0] },
    ];

    return (
        <group ref={group} dispose={null}>
            {/* gum and tongue */}
            <mesh geometry={nodes.upper_jaw.geometry} material={materials.Gum} position={[0, 0.36, -0.29]} rotation={[1.11, 0, 0]} scale={39.99} />
            <mesh geometry={nodes.lower_jaw.geometry} material={materials.Gum} position={[0, 0.36, -0.07]} rotation={[Math.PI / 2, 0, 0]} scale={39.99} />
            <mesh geometry={nodes.tongue.geometry} material={materials.tongue} position={[0, 0.36, -0.07]} rotation={[Math.PI / 2, 0, 0]} scale={39.99} />

            {/* teeth color coding */}
            {teethList.map(tooth => {
                const treatments = teethData[tooth.name] || [];
                let color = '#FFFFFF';

                if (filter && treatments.includes(filter)) {
                    color = getColorFromTreatment(filter);
                } else if (!filter && treatments.length > 0) {
                    color = getColorFromTreatment(treatments[treatments.length - 1]);
                }

                return (
                    <mesh
                        key={tooth.name}
                        geometry={tooth.node.geometry}
                        position={tooth.pos}
                        rotation={tooth.rot}
                        scale={39.99}
                        onClick={() => (window.location = `/${tooth.name.replace(/_/g, '-')}`)}
                    >
                        <meshStandardMaterial color={color} />
                    </mesh>
                );
            })}
        </group>
    );
};

// ================= Filter Menu =================
const FilterMenu = ({ filter, setFilter }) => {
    return (
        <div className="filter-menu">
            <button onClick={() => setFilter(null)}>All</button>
            {TREATMENTS.map(t => (
                <button key={t.key} style={{ backgroundColor: t.colour }} onClick={() => setFilter(t.key)}>
                    {t.label}
                </button>
            ))}
        </div>
    );
};

// ================= 整合组件 =================
export default function WholeMouth() {
    const [filter, setFilter] = useState(null);
    const [teethData, setTeethData] = useState({}); // { toothName: [treatmentKey,...] }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:3000/all-teeth'); // 后端接口，返回每颗牙齿的治疗数组
                const data = res.data; // { lower_right_wisdom: ['filling'], lower_right_second_molar: ['crown'], ... }
                console.log("data is", data);
                setTeethData(data);
            } catch (err) {
                console.error(err);
                setTeethData({});
            }
        };
        fetchData();
    }, []);

    return (
        <div className="mouth-container">
            <FilterMenu filter={filter} setFilter={setFilter} />
            <Canvas>
                <CameraController />
                <ambientLight intensity={0.7} />
                <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]} />
                <Suspense fallback={null}>
                    <WholeMouthModel teethData={teethData} filter={filter} />
                </Suspense>
            </Canvas>
            <p className="mouth-instructions mouth-info">
                Tap and drag to interact with the mouth. Tap a tooth to view further details.
            </p>
        </div>
    );
}
