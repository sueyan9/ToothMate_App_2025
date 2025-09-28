import { useGLTF } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import '../styles.css';
//import { toothData } from './ToothData';
//import teethData from './Util/toothData.json';

const CameraController = () => {
  const { camera, gl } = useThree()

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement)


      controls.minDistance = 5;
      controls.maxDistance = 6;

      controls.minPolarAngle = Math.PI / 3; // 45 degrees
      controls.maxPolarAngle = Math.PI / 1.6; // 100 degrees

      controls.minAzimuthAngle = -Math.PI / 4; // -45 degrees
      controls.maxAzimuthAngle = Math.PI / 4;  // 45 degrees

      controls.rotateSpeed = 0.8;

      // Reduce panning speed
      controls.panSpeed = 1.0;

      return () => {
          controls.dispose()
      }
  }, [camera, gl])
    return null
}


const WholeMouthModel = ({ selectedTreatment, activeTimePeriod, missingTeeth = [], ...props }) => {
  const group = useRef()

  const toothMaterials = {
    filling: new THREE.MeshStandardMaterial({
      color: '#C00A0A',
      roughness: 0.1,
      metalness: 0.1,
    }),
    crown: new THREE.MeshStandardMaterial({
      color: '#FF5100',
      roughness: 0.1,
      metalness: 0.1,
    }),
    bridge: new THREE.MeshStandardMaterial({
      color: '#FFD500',
      roughness: 0.1,
      metalness: 0.1,
    }),
    implant: new THREE.MeshStandardMaterial({
      color: '#007610',
      roughness: 0.1,
      metalness: 0.1,
    }),
    extraction: new THREE.MeshStandardMaterial({
      color: '#5C5C5C',
      roughness: 0.1,
      metalness: 0.1,
      opacity: 0.6,
      transparent: true,
    }),
    rootCanal: new THREE.MeshStandardMaterial({
      color: '#0080FF',
      roughness: 0.1,
      metalness: 0.1,
    }),
    veneer: new THREE.MeshStandardMaterial({
      color: '#7B00FF',
      roughness: 0.1,
      metalness: 0.1,
    }),
    sealant: new THREE.MeshStandardMaterial({
      color: '#FF0099',
      roughness: 0.1,
      metalness: 0.1,
    }),
    missing: new THREE.MeshStandardMaterial({
      color: 'white',
      opacity: 0.0,
      transparent: true,
    }),
    normal: new THREE.MeshStandardMaterial({
      color: '#5C5C5C',
      roughness: 0.1,
      metalness: 0.1,
    }),
  }

  // Function to convert treatment type strings to match material keys
  const normalizeTreatmentType = (treatmentType) => {
    const typeMap = {
      'Root Canal': 'rootCanal',
      'Crown Placement': 'crown',
      'Filling': 'filling',
      'Extraction': 'extraction',
      'Bridge': 'bridge',
      'Implant': 'implant',
      'Veneer': 'veneer',
      'Sealant': 'sealant',
      'Cleaning': 'normal', // Cleaning doesn't change tooth appearance
      'Checkup': 'normal'   // Checkup doesn't change tooth appearance
    };
    return typeMap[treatmentType] || treatmentType.toLowerCase();
  };

    // ================= 3D tooth model =================
    const WholeMouthModel = ({teethData, filter, extracted, onToothClick}) => {
        const group = useRef();
        const {nodes, materials} = useGLTF('/assets/adult_whole_mouth.glb');

        console.log("teethData is", teethData)
        // tooth list include name and locations of all teeth mesh
        const teethList = [
            // LOWER RIGHT (41-48)
            {
                name: 'lower_right_wisdom',
                node: nodes.lower_right_wisdom,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 48
            },
            {
                name: 'lower_right_second_molar',
                node: nodes.lower_right_second_molar,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 47
            },
            {
                name: 'lower_right_first_molar',
                node: nodes.lower_right_first_molar,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 46
            },
            {
                name: 'lower_right_second_premolar',
                node: nodes.lower_right_second_premolar,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 45
            },
            {
                name: 'lower_right_first_premolar',
                node: nodes.lower_right_first_premolar,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 44
            },
            {
                name: 'lower_right_canine',
                node: nodes.lower_right_canine,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 43
            },
            {
                name: 'lower_right_lateral_incisor',
                node: nodes.lower_right_lateral_incisor,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 42
            },
            {
                name: 'lower_right_central_incisor',
                node: nodes.lower_right_central_incisor,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 41
            },

            // LOWER LEFT (31-38)
            {
                name: 'lower_left_wisdom',
                node: nodes.lower_left_wisdom,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 38
            },
            {
                name: 'lower_left_second_molar',
                node: nodes.lower_left_second_molar,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 37
            },
            {
                name: 'lower_left_first_molar',
                node: nodes.lower_left_first_molar,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 36
            },
            {
                name: 'lower_left_second_premolar',
                node: nodes.lower_left_second_premolar,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 35
            },
            {
                name: 'lower_left_first_premolar',
                node: nodes.lower_left_first_premolar,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 34
            },
            {
                name: 'lower_left_canine',
                node: nodes.lower_left_canine,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 33
            },
            {
                name: 'lower_left_lateral_incisor',
                node: nodes.lower_left_lateral_incisor,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 32
            },
            {
                name: 'lower_left_central_incisor',
                node: nodes.lower_left_central_incisor,
                pos: [0, 0.36, -0.07],
                rot: [Math.PI / 2, 0, 0],
                toothNumber: 31
            },

            // UPPER RIGHT (11-18)
            {
                name: 'upper_right_wisdom',
                node: nodes.upper_right_wisdom,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 18
            },
            {
                name: 'upper_right_second_molar',
                node: nodes.upper_right_second_molar,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 17
            },
            {
                name: 'upper_right_first_molar',
                node: nodes.upper_right_first_molar,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 16
            },
            {
                name: 'upper_right_second_premolar',
                node: nodes.upper_right_second_premolar,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 15
            },
            {
                name: 'upper_right_first_premolar',
                node: nodes.upper_right_first_premolar,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 14
            },
            {
                name: 'upper_right_canine',
                node: nodes.upper_right_canine,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 13
            },
            {
                name: 'upper_right_lateral_incisor',
                node: nodes.upper_right_lateral_incisor,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 12
            },
            {
                name: 'upper_right_central_incisor',
                node: nodes.upper_right_central_incisor,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 11
            },
// UPPER LEFT (21-28)
            {
                name: 'upper_left_wisdom',
                node: nodes.upper_left_wisdom,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 28
            },
            {
                name: 'upper_left_second_molar',
                node: nodes.upper_left_second_molar,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 27
            },
            {
                name: 'upper_left_first_molar',
                node: nodes.upper_left_first_molar,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 26
            },
            {
                name: 'upper_left_second_premolar',
                node: nodes.upper_left_second_premolar,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 25
            },
            {
                name: 'upper_left_first_premolar',
                node: nodes.upper_left_first_premolar,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 24
            },
            {
                name: 'upper_left_canine',
                node: nodes.upper_left_canine,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 23
            },
            {
                name: 'upper_left_lateral_incisor',
                node: nodes.upper_left_lateral_incisor,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 22
            },
            {
                name: 'upper_left_central_incisor',
                node: nodes.upper_left_central_incisor,
                pos: [0, 0.36, -0.29],
                rot: [1.11, 0, 0],
                toothNumber: 21
            },
        ];



        return (
            <group ref={group} dispose={null}>
                {/* gum and tongue */}
                <mesh geometry={nodes.upper_jaw.geometry} material={materials.Gum} position={[0, 0.36, -0.29]}
                      rotation={[1.11, 0, 0]} scale={39.99}/>
                <mesh geometry={nodes.lower_jaw.geometry} material={materials.Gum} position={[0, 0.36, -0.07]}
                      rotation={[Math.PI / 2, 0, 0]} scale={39.99}/>
                <mesh geometry={nodes.tongue.geometry} material={materials.tongue} position={[0, 0.36, -0.07]}
                      rotation={[Math.PI / 2, 0, 0]} scale={39.99}/>

                {/* teeth color coding */}
                {teethList.map(tooth => {
                    const key = String(tooth.toothNumber);

                    // 获取当前牙齿的治疗类型数组，并做标准化
                    const treatments = (teethData[key] || []).map(
                        t => (NORMALIZE[t] || t.toLowerCase().replace(/\s+/g, '-'))
                    );

                    console.log("treatments teeth is",treatments)
                    // 判断牙齿是否拔除
                    const isExtracted = (extracted?.has?.(tooth.toothNumber) ?? false) || treatments.includes('extraction');

                    // 获取牙齿颜色：如果有治疗类型就取第一个，否则白色
                    const baseColor = treatments.length > 0 ? getColorFromTreatment(treatments[0]) : '#FFFFFF';

                    return (
                        <mesh
                            key={tooth.name}
                            geometry={tooth.node.geometry}
                            position={tooth.pos}
                            rotation={tooth.rot}
                            scale={39.99}
                            // 隐藏拔除牙齿（如果 filter 还是 "extraction" 的话）
                            visible={!(filter === 'extraction' && isExtracted)}
                            material={undefined}
                            onClick={() => onToothClick?.(tooth.toothNumber)}
                        >
                            <meshStandardMaterial
                                key={`${tooth.toothNumber}-${baseColor}-${isExtracted ? 'x' : 'o'}`}
                                color={baseColor}
                                // 拔牙半透明
                                opacity={isExtracted ? 0.35 : 1}
                                transparent={isExtracted}
                                metalness={0}
                                roughness={0.9}
                            />
                        </mesh>
                    );
                })}
            </group>
        );
    };


// ================= Main Component =================

    export default function WholeMouth(props) {

        const {selectedTreatment, activeTimePeriod } = props;
        console.log("selectedTreatment is a", selectedTreatment);
        const userId =
            props?.userId ??
            localStorage.getItem('userId') ??
            '682518450700231916c14fea';

        const [filter, setFilter] = useState(null);
        const [teethData, setTeethData] = useState({}); // { toothName: [treatmentKey,...] }
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [allTeeth, setAllTeeth] = useState([]);
        const [allTreatments, setAllTreatments] = useState([]);
        const [extracted, setExtracted] = useState(new Set());
        useEffect(() => {
            if (!userId) return; // If userId is empty, don't call API

            const fetchData = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    // 1. Get user information (including NHI)
                    const userRes = await axios.get(`http://localhost:3000/user/${userId}`);
                    const userData = userRes.data;

                    if (!userData.nhi) {
                        throw new Error("User NHI does not exist");
                    }

                    // 2. Get all teeth for the user
                    const teethRes = await axios.get(`http://localhost:3000/getAllTeeth/${userData.nhi}`);
                    const teeth = teethRes.data;
                    setAllTeeth(teeth);

                    // 3. Get all treatment records for the user
                    const treatmentsRes = await axios.get(`http://localhost:3000/getTreatmentsByUser/${userData.nhi}`);
                    const treatments = treatmentsRes.data;
                    setAllTreatments(treatments);

                    // 4. Build extracted set
                    const extractedSet = new Set();

                    teeth.forEach(t => {
                        if (t.extracted) {
                            extractedSet.add(t.tooth_number);
                        }
                    });

                    treatments.forEach(tr => {
                        if (tr.treatmentType === 'extraction' && tr.status === 'completed') {
                            extractedSet.add(tr.tooth_number);
                        }
                    });
                    setExtracted(extractedSet);

                    // 5. Create teeth treatment mapping
                    // key - treatment
                    const teethDataMap = {};
                    console.log("selectedTreatment is",selectedTreatment)
                    teeth.forEach((tooth) => {
                        // find all treatments related of this tooth
                        let toothTreatments = treatments.filter(
                            t => t.tooth_number === tooth.tooth_number
                        );
                        console.log("toothTreatments 1", toothTreatments);

                        // === 1. filter according period  ===
                        if (selectedTreatment?.period) {
                            if (selectedTreatment.period === 'historical') {
                                toothTreatments = toothTreatments.filter(t => t.status === 'completed');
                            } else if (selectedTreatment.period === 'future') {
                                toothTreatments = toothTreatments.filter(t => t.status === 'planned');
                            } else if (selectedTreatment.period === 'all') {
                                // all => No filter（planned + completed ）
                            }
                        }



                        // === 2.filter according treatment  ===
                        if (selectedTreatment?.treatment) {
                            toothTreatments = toothTreatments.filter(
                                t => t.treatmentType === selectedTreatment.treatment
                            );
                        }
                        console.log("toothTreatments 2", toothTreatments);

                        // === 3. If there is more data，write into map ===
                        if (toothTreatments.length > 0) {
                            const toothKey = tooth.tooth_number;
                            teethDataMap[toothKey] = toothTreatments.map(t => t.treatmentType);
                        }
                    });
                    console.log("teethDataMap 3 is", teethDataMap)

                    setTeethData(teethDataMap);

                } catch (err) {
                    setError(err.message);
                    setTeethData({});
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, [selectedTreatment]);

        // Show loading state
        if (loading) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column'
                }}>
                    <div>Loading user data...</div>
                    <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
                        Fetching teeth and treatment information...
                    </div>
                </div>
            );
        }

        // Show error state
        if (error) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column',
                    color: '#ff6b6b'
                }}>
                    <div>Error loading data</div>
                    <div style={{fontSize: '12px', marginTop: '10px'}}>
                        {error}
                    </div>
                </div>
            );
        }

        // Show empty data state
        if (!userId) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    color: '#666'
                }}>
                    Please provide a userId to view dental information
                </div>
            );
        }

        // when click happened, nav to a tooth detail  page
        const handleToothClick = (toothNumber) => {

            if (!allTeeth || !allTreatments) {
                return;
            }

            // mapping tooth name to tooth_number
            const toothRouteMap = {
                // LOWER LEFT (31-38)
                31: '/lower-left-central-incisor',
                32: '/lower-left-lateral-incisor',
                33: '/lower-left-canine',
                34: '/lower-left-first-premolar',
                35: '/lower-left-second-premolar',
                36: '/lower-left-first-molar',
                37: '/lower-left-second-molar',
                38: '/lower-left-wisdom',

                // LOWER RIGHT (41-48)
                41: '/lower-right-central-incisor',
                42: '/lower-right-lateral-incisor',
                43: '/lower-right-canine',
                44: '/lower-right-first-premolar',
                45: '/lower-right-second-premolar',
                46: '/lower-right-first-molar',
                47: '/lower-right-second-molar',
                48: '/lower-right-wisdom',

                // UPPER LEFT (21-28)
                21: '/upper-left-central-incisor',
                22: '/upper-left-lateral-incisor',
                23: '/upper-left-canine',
                24: '/upper-left-first-premolar',
                25: '/upper-left-second-premolar',
                26: '/upper-left-first-molar',
                27: '/upper-left-second-molar',
                28: '/upper-left-wisdom',

                // UPPER RIGHT (11-18)
                11: '/upper-right-central-incisor',
                12: '/upper-right-lateral-incisor',
                13: '/upper-right-canine',
                14: '/upper-right-first-premolar',
                15: '/upper-right-second-premolar',
                16: '/upper-right-first-molar',
                17: '/upper-right-second-molar',
                18: '/upper-right-wisdom',
            };
            const route = toothRouteMap[toothNumber];
            if (route) {
                const url = `${route}?teeth=${encodeURIComponent(JSON.stringify(allTeeth))}&treatments=${encodeURIComponent(JSON.stringify(allTreatments))}`;
                window.location = url;
            } else {
                console.error(" No route found for tooth number:", toothNumber);
            }
        };

        return (
            <group ref={group} dispose={null}>
                {/* gum and tongue */}
                <mesh geometry={nodes.upper_jaw.geometry} material={materials.Gum} position={[0, 0.36, -0.29]}
                      rotation={[1.11, 0, 0]} scale={39.99}/>
                <mesh geometry={nodes.lower_jaw.geometry} material={materials.Gum} position={[0, 0.36, -0.07]}
                      rotation={[Math.PI / 2, 0, 0]} scale={39.99}/>
                <mesh geometry={nodes.tongue.geometry} material={materials.tongue} position={[0, 0.36, -0.07]}
                      rotation={[Math.PI / 2, 0, 0]} scale={39.99}/>

                {/* teeth color coding */}
                {teethList.map(tooth => {
                    const key = String(tooth.toothNumber);

                    // 获取当前牙齿的治疗类型数组，并做标准化
                    const treatments = (teethData[key] || []).map(
                        t => (NORMALIZE[t] || t.toLowerCase().replace(/\s+/g, '-'))
                    );

                    console.log("treatments teeth is",treatments)
                    // 判断牙齿是否拔除
                    const isExtracted = (extracted?.has?.(tooth.toothNumber) ?? false) || treatments.includes('extraction');

                    // 获取牙齿颜色：如果有治疗类型就取第一个，否则白色
                    const baseColor = treatments.length > 0 ? getColorFromTreatment(treatments[0]) : '#FFFFFF';

                    return (
                        <mesh
                            key={tooth.name}
                            geometry={tooth.node.geometry}
                            position={tooth.pos}
                            rotation={tooth.rot}
                            scale={39.99}
                            // 隐藏拔除牙齿（如果 filter 还是 "extraction" 的话）
                            visible={!(filter === 'extraction' && isExtracted)}
                            material={undefined}
                            onClick={() => onToothClick?.(tooth.toothNumber)}
                        >
                            <meshStandardMaterial
                                key={`${tooth.toothNumber}-${baseColor}-${isExtracted ? 'x' : 'o'}`}
                                color={baseColor}
                                // 拔牙半透明
                                opacity={isExtracted ? 0.35 : 1}
                                transparent={isExtracted}
                                metalness={0}
                                roughness={0.9}
                            />
                        </mesh>
                    );
                })}
            </group>
        );
    };


// ================= Main Component =================

    export default function WholeMouth(props) {

        const {selectedTreatment, activeTimePeriod } = props;
        console.log("selectedTreatment is a", selectedTreatment);
        const userId =
            props?.userId ??
            localStorage.getItem('userId') ??
            '682518450700231916c14fea';

        const [filter, setFilter] = useState(null);
        const [teethData, setTeethData] = useState({}); // { toothName: [treatmentKey,...] }
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [allTeeth, setAllTeeth] = useState([]);
        const [allTreatments, setAllTreatments] = useState([]);
        const [extracted, setExtracted] = useState(new Set());
        useEffect(() => {
            if (!userId) return; // If userId is empty, don't call API

            const fetchData = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    // 1. Get user information (including NHI)
                    const userRes = await axios.get(`http://localhost:3000/user/${userId}`);
                    const userData = userRes.data;

                    if (!userData.nhi) {
                        throw new Error("User NHI does not exist");
                    }

                    // 2. Get all teeth for the user
                    const teethRes = await axios.get(`http://localhost:3000/getAllTeeth/${userData.nhi}`);
                    const teeth = teethRes.data;
                    setAllTeeth(teeth);

                    // 3. Get all treatment records for the user
                    const treatmentsRes = await axios.get(`http://localhost:3000/getTreatmentsByUser/${userData.nhi}`);
                    const treatments = treatmentsRes.data;
                    setAllTreatments(treatments);

                    // 4. Build extracted set
                    const extractedSet = new Set();

                    teeth.forEach(t => {
                        if (t.extracted) {
                            extractedSet.add(t.tooth_number);
                        }
                    });

                    treatments.forEach(tr => {
                        if (tr.treatmentType === 'extraction' && tr.status === 'completed') {
                            extractedSet.add(tr.tooth_number);
                        }
                    });
                    setExtracted(extractedSet);

                    // 5. Create teeth treatment mapping
                    // key - treatment
                    const teethDataMap = {};
                    console.log("selectedTreatment is",selectedTreatment)
                    teeth.forEach((tooth) => {
                        // find all treatments related of this tooth
                        let toothTreatments = treatments.filter(
                            t => t.tooth_number === tooth.tooth_number
                        );
                        console.log("toothTreatments 1", toothTreatments);

                        // === 1. filter according period  ===
                        if (selectedTreatment?.period) {
                            if (selectedTreatment.period === 'historical') {
                                toothTreatments = toothTreatments.filter(t => t.status === 'completed');
                            } else if (selectedTreatment.period === 'future') {
                                toothTreatments = toothTreatments.filter(t => t.status === 'planned');
                            } else if (selectedTreatment.period === 'all') {
                                // all => No filter（planned + completed ）
                            }
                        }



                        // === 2.filter according treatment  ===
                        if (selectedTreatment?.treatment) {
                            toothTreatments = toothTreatments.filter(
                                t => t.treatmentType === selectedTreatment.treatment
                            );
                        }
                        console.log("toothTreatments 2", toothTreatments);

                        // === 3. If there is more data，write into map ===
                        if (toothTreatments.length > 0) {
                            const toothKey = tooth.tooth_number;
                            teethDataMap[toothKey] = toothTreatments.map(t => t.treatmentType);
                        }
                    });
                    console.log("teethDataMap 3 is", teethDataMap)

                    setTeethData(teethDataMap);

                } catch (err) {
                    setError(err.message);
                    setTeethData({});
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, [selectedTreatment]);

        // Show loading state
        if (loading) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column'
                }}>
                    <div>Loading user data...</div>
                    <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
                        Fetching teeth and treatment information...
                    </div>
                </div>
            );
        }

        // Show error state
        if (error) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column',
                    color: '#ff6b6b'
                }}>
                    <div>Error loading data</div>
                    <div style={{fontSize: '12px', marginTop: '10px'}}>
                        {error}
                    </div>
                </div>
            );
        }

        // Show empty data state
        if (!userId) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    color: '#666'
                }}>
                    Please provide a userId to view dental information
                </div>
            );
        }

        // when click happened, nav to a tooth detail  page
        const handleToothClick = (toothNumber) => {

            if (!allTeeth || !allTreatments) {
                return;
            }

            // mapping tooth name to tooth_number
            const toothRouteMap = {
                // LOWER LEFT (31-38)
                31: '/lower-left-central-incisor',
                32: '/lower-left-lateral-incisor',
                33: '/lower-left-canine',
                34: '/lower-left-first-premolar',
                35: '/lower-left-second-premolar',
                36: '/lower-left-first-molar',
                37: '/lower-left-second-molar',
                38: '/lower-left-wisdom',

                // LOWER RIGHT (41-48)
                41: '/lower-right-central-incisor',
                42: '/lower-right-lateral-incisor',
                43: '/lower-right-canine',
                44: '/lower-right-first-premolar',
                45: '/lower-right-second-premolar',
                46: '/lower-right-first-molar',
                47: '/lower-right-second-molar',
                48: '/lower-right-wisdom',

                // UPPER LEFT (21-28)
                21: '/upper-left-central-incisor',
                22: '/upper-left-lateral-incisor',
                23: '/upper-left-canine',
                24: '/upper-left-first-premolar',
                25: '/upper-left-second-premolar',
                26: '/upper-left-first-molar',
                27: '/upper-left-second-molar',
                28: '/upper-left-wisdom',

                // UPPER RIGHT (11-18)
                11: '/upper-right-central-incisor',
                12: '/upper-right-lateral-incisor',
                13: '/upper-right-canine',
                14: '/upper-right-first-premolar',
                15: '/upper-right-second-premolar',
                16: '/upper-right-first-molar',
                17: '/upper-right-second-molar',
                18: '/upper-right-wisdom',
            };
            const route = toothRouteMap[toothNumber];
            if (route) {
                const url = `${route}?teeth=${encodeURIComponent(JSON.stringify(allTeeth))}&treatments=${encodeURIComponent(JSON.stringify(allTreatments))}`;
                window.location = url;
            } else {
                console.error(" No route found for tooth number:", toothNumber);
            }
        };

        return (
            <div className="mouth-container">
                <Canvas>
                    <CameraController/>
                    <ambientLight intensity={0.7}/>
                    <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]}/>
                    <Suspense fallback={null}>
                        <WholeMouthModel
                            teethData={teethData}
                            filter={filter}
                            extracted={extracted}
                            onToothClick={handleToothClick}/>
                    </Suspense>
                </Canvas>
                <p className="mouth-instructions mouth-info">
                    Tap and drag to interact with the mouth. Tap a tooth to view further details.
                </p>
            </div>
        );

    }