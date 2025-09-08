import { useGLTF } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import '../styles.css';
import { toothData } from './ToothData';
import teethData from './Util/toothData.json';

const CameraController = () => {
  const { camera, gl } = useThree()

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement)

    controls.minDistance = 5.5;
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

  // Get treatments from JSON data based on time period
  const getJsonTreatments = (toothNumber, timePeriod) => {
    const toothInfo = teethData.teeth[toothNumber.toString()];
    if (!toothInfo) return [];

    const treatmentArray = timePeriod === 'historical'
      ? toothInfo.treatments
      : toothInfo.futuretreatments;

    return treatmentArray.map(treatment => normalizeTreatmentType(treatment.type));
  };

  const getToothMaterial = (toothNumber, originalTreatmentType) => {
    // Handle missing teeth
    if (originalTreatmentType === 'missing') {
      return toothMaterials.missing;
    }

    // If historical or future mode is active, override with JSON data
    if (activeTimePeriod === 'historical' || activeTimePeriod === 'future') {
      const jsonTreatments = getJsonTreatments(toothNumber, activeTimePeriod);

      // If no treatments in JSON for this time period, show normal
      if (jsonTreatments.length === 0) {
        return toothMaterials.normal;
      }

  // === MODIFIED LOGIC HERE ===
  // If the selectedTreatment array is empty, it means 'Clear All Treatments' was pressed.
  // In this case, always return the normal tooth material.
  if (!selectedTreatment || selectedTreatment[0] === 'none') {
    if (originalTreatmentType === 'extraction') {
      return toothMaterials.missing;
      }
    return toothMaterials.normal;
  }

  // Original filter logic for treatment types
  if (!selectedTreatment) {
    return toothMaterials.normal;
  }
  if (selectedTreatment.includes(originalTreatmentType)) {
    return toothMaterials[originalTreatmentType] || toothMaterials.normal;
  }

  if (originalTreatmentType === 'extraction') {
      return toothMaterials.missing;
    }

  return toothMaterials.normal;
}

    // Original filter logic for treatment types
    if (!selectedTreatment || selectedTreatment[0] === 'none') {
      if (originalTreatmentType === 'extraction') {
      return toothMaterials.missing;
      }
      return toothMaterials.normal;
    }
    if (selectedTreatment.includes(originalTreatmentType)) {
      return toothMaterials[originalTreatmentType] || toothMaterials.normal;
    }

    if (originalTreatmentType === 'extraction') {
      return toothMaterials.missing;
    }

return toothMaterials.normal;
}

  const { nodes, materials } = useGLTF('/assets/adult_whole_mouth.glb')

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        geometry={nodes.upper_jaw.geometry}
        material={materials.Gum}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
      />
      <mesh
        geometry={nodes.lower_jaw.geometry}
        material={materials.Gum}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
      />
      <mesh
        geometry={nodes.tongue.geometry}
        material={materials.tongue}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
      />

      {/* LOWER RIGHT */}
      <mesh
        geometry={nodes.lower_right_wisdom.geometry}
        material={getToothMaterial(48, toothData[48].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-wisdom')}
      />
      <mesh
        geometry={nodes.lower_right_second_molar.geometry}
        material={getToothMaterial(47, toothData[47].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-second-molar')}
      />
      <mesh
        geometry={nodes.lower_right_first_molar.geometry}
        material={getToothMaterial(46, toothData[46].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-first-molar')}
      />
      <mesh
        geometry={nodes.lower_right_second_premolar.geometry}
        material={getToothMaterial(45, toothData[45].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-second-premolar')}
      />
      <mesh
        geometry={nodes.lower_right_first_premolar.geometry}
        material={getToothMaterial(44, toothData[44].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-first-premolar')}
      />
      <mesh
        geometry={nodes.lower_right_canine.geometry}
        material={getToothMaterial(43, toothData[43].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-canine')}
      />
      <mesh
        geometry={nodes.lower_right_lateral_incisor.geometry}
        material={getToothMaterial(42, toothData[42].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-lateral-incisor')}
      />
      <mesh
        geometry={nodes.lower_right_central_incisor.geometry}
        material={getToothMaterial(41, toothData[41].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-central-incisor')}
      />

      {/* LOWER LEFT */}
      <mesh
        geometry={nodes.lower_left_wisdom.geometry}
        material={getToothMaterial(38, toothData[38].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-wisdom')}
      />
      <mesh
        geometry={nodes.lower_left_second_molar.geometry}
        material={getToothMaterial(37, toothData[37].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-second-molar')}
      />
      <mesh
        geometry={nodes.lower_left_first_molar.geometry}
        material={getToothMaterial(36, toothData[36].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-first-molar')}
      />
      <mesh
        geometry={nodes.lower_left_second_premolar.geometry}
        material={getToothMaterial(35, toothData[35].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-second-premolar')}
      />
      <mesh
        geometry={nodes.lower_left_first_premolar.geometry}
        material={getToothMaterial(34, toothData[34].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-first-premolar')}
      />
      <mesh
        geometry={nodes.lower_left_canine.geometry}
        material={getToothMaterial(33, toothData[33].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-canine')}
      />
      <mesh
        geometry={nodes.lower_left_lateral_incisor.geometry}
        material={getToothMaterial(32, toothData[32].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-lateral-incisor')}
      />
      <mesh
        geometry={nodes.lower_left_central_incisor.geometry}
        material={getToothMaterial(31, toothData[31].treatment)}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-central-incisor')}
      />

      {/* UPPER RIGHT */}
      <mesh
        geometry={nodes.upper_right_wisdom.geometry}
        material={getToothMaterial(18, toothData[18].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-wisdom')}
      />
      <mesh
        geometry={nodes.upper_right_second_molar.geometry}
        material={getToothMaterial(17, toothData[17].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-second-molar')}
      />
      <mesh
        geometry={nodes.upper_right_first_molar.geometry}
        material={getToothMaterial(16, toothData[16].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-first-molar')}
      />
      <mesh
        geometry={nodes.upper_right_second_premolar.geometry}
        material={getToothMaterial(15, toothData[15].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-second-premolar')}
      />
      <mesh
        geometry={nodes.upper_right_first_premolar.geometry}
        material={getToothMaterial(14, toothData[14].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-first-premolar')}
      />
      <mesh
        geometry={nodes.upper_right_canine.geometry}
        material={getToothMaterial(13, toothData[13].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-canine')}
      />
      <mesh
        geometry={nodes.upper_right_lateral_incisor.geometry}
        material={getToothMaterial(12, toothData[12].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-lateral-incisor')}
      />
      <mesh
        geometry={nodes.upper_right_central_incisor.geometry}
        material={getToothMaterial(11, toothData[11].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-central-incisor')}
      />

      {/* UPPER LEFT */}
      <mesh
        geometry={nodes.upper_left_wisdom.geometry}
        material={getToothMaterial(28, toothData[28].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-wisdom')}
      />
      <mesh
        geometry={nodes.upper_left_second_molar.geometry}
        material={getToothMaterial(27, toothData[27].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-second-molar')}
      />
      <mesh
        geometry={nodes.upper_left_first_molar.geometry}
        material={getToothMaterial(26, toothData[26].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-first-molar')}
      />
      <mesh
        geometry={nodes.upper_left_second_premolar.geometry}
        material={getToothMaterial(25, toothData[25].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-second-premolar')}
      />
      <mesh
        geometry={nodes.upper_left_first_premolar.geometry}
        material={getToothMaterial(24, toothData[24].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-first-premolar')}
      />
      <mesh
        geometry={nodes.upper_left_canine.geometry}
        material={getToothMaterial(23, toothData[23].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-canine')}
      />
      <mesh
        geometry={nodes.upper_left_lateral_incisor.geometry}
        material={getToothMaterial(22, toothData[22].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-lateral-incisor')}
      />
      <mesh
        geometry={nodes.upper_left_central_incisor.geometry}
        material={getToothMaterial(21, toothData[21].treatment)}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-central-incisor')}
      />
    </group>
  )
}

export default function WholeMouth({ selectedTreatment, activeTimePeriod, setSelectedTreatment }) {

  return (
    <div className='mouth-container'>
      <Canvas>
        <CameraController />
        <ambientLight intensity={0.7} />
        <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]} />
        <Suspense fallback={null}>
          <WholeMouthModel selectedTreatment={selectedTreatment} activeTimePeriod={activeTimePeriod} />
        </Suspense>
      </Canvas>

      {/*<p className='mouth-instructions mouth-info'>Tap and drag to interact with the mouth. Tap a tooth to view further details.</p>*/}

    </div>
  )
}