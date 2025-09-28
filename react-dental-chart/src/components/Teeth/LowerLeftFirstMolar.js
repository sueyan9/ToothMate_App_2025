import { useGLTF } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ToothInformation from '../ToothInformation';


const CameraController = () => {
  const { camera, gl } = useThree()

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement)

    controls.minDistance = 3
    controls.maxDistance = 4
    return () => {
      controls.dispose()
    }
  }, [camera, gl])
  return null
}

const LeftLowerFirstMolar = ({ ...props }) => {
  const group = useRef()

  const { nodes, materials } = useGLTF('/assets/Left_Lower_First_Molar.glb')

  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[0, -1.48, 0]} rotation={[Math.PI / 2, 0, 1.4]} scale={0.5}>
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_2.geometry}
          material={materials['1']}
          material-color={'lightblue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_3.geometry}
          material={materials['2']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_4.geometry}
          material={materials['3']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_5.geometry}
          material={materials['4']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_6.geometry}
          material={materials['5']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_7.geometry}
          material={materials['6']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_8.geometry}
          material={materials['7']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_9.geometry}
          material={materials['8']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_10.geometry}
          material={materials['9']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_11.geometry}
          material={materials['10']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_12.geometry}
          material={materials['11']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_13.geometry}
          material={materials['12']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_14.geometry}
          material={materials['13']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_15.geometry}
          material={materials['14']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_16.geometry}
          material={materials['15']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_17.geometry}
          material={materials['16']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_18.geometry}
          material={materials['17']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_19.geometry}
          material={materials['18']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_20.geometry}
          material={materials['19']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_21.geometry}
          material={materials['20']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_22.geometry}
          material={materials['21']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_23.geometry}
          material={materials['22']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_24.geometry}
          material={materials['23']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_25.geometry}
          material={materials['24']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_26.geometry}
          material={materials['25']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_27.geometry}
          material={materials['26']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_28.geometry}
          material={materials['27']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_29.geometry}
          material={materials['28']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_30.geometry}
          material={materials['29']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_1.geometry}
          material={materials['30']}
        />
      </group>
    </group>
  )
}

export const LowerLeftFirstMolar = () => {
  const [teethData, setTeethData] = useState([]);
  const [treatmentsData, setTreatmentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search);
    const teethParam = urlParams.get('teeth');
    const treatmentsParam = urlParams.get('treatments');

    if (teethParam && treatmentsParam) {
      try {
        const teeth = JSON.parse(decodeURIComponent(teethParam));
        const treatments = JSON.parse(decodeURIComponent(treatmentsParam));

        setTeethData(teeth);
        setTreatmentsData(treatments);
        setIsLoading(false);

      } catch (err) {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading tooth data...</div>;
  }
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
      <Canvas style={{ width: '100%', height: '80%' }}>
        <CameraController />
        <ambientLight intensity={0.7} />
        <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]} />
        <Suspense fallback={null}>
          <LeftLowerFirstMolar />
        </Suspense>
      </Canvas>
      </div>


      <div>Lower left first molar</div>

      <ToothInformation
          toothNumber={36}
          allTeeth={teethData}
          allTreatments={treatmentsData}
      />

    </>
  )
}
