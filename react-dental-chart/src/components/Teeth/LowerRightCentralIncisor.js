import { useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import ToothInformation from '../ToothInformation'

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

const RightLowerCentralIncisor = ({ ...props }) => {
  const group = useRef()

  const { nodes, materials } = useGLTF('/assets/Right_Lower_Central_Incisor.glb')

  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[0, -1.72, 0]} rotation={[Math.PI / 2, 0, 0.02]} scale={[-0.79, 0.85, 0.79]}>
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_1.geometry}
          material={materials['1']}
          material-color={'lightblue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_2.geometry}
          material={materials['2']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_3.geometry}
          material={materials['3']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_4.geometry}
          material={materials['4']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_5.geometry}
          material={materials['5']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_6.geometry}
          material={materials['6']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_7.geometry}
          material={materials['7']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_8.geometry}
          material={materials['8']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_9.geometry}
          material={materials['9']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_10.geometry}
          material={materials['10']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_11.geometry}
          material={materials['11']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_12.geometry}
          material={materials['12']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_13.geometry}
          material={materials['13']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_14.geometry}
          material={materials['14']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_15.geometry}
          material={materials['15']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_16.geometry}
          material={materials['16']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_17.geometry}
          material={materials['17']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_18.geometry}
          material={materials['18']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_19.geometry}
          material={materials['19']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_20.geometry}
          material={materials['20']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_21.geometry}
          material={materials['21']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_22.geometry}
          material={materials['22']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_23.geometry}
          material={materials['23']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_24.geometry}
          material={materials['24']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_25.geometry}
          material={materials['25']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_26.geometry}
          material={materials['26']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_27.geometry}
          material={materials['27']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_28.geometry}
          material={materials['28']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_29.geometry}
          material={materials['29']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Central_Incisor_30.geometry}
          material={materials['30']}
        />
      </group>
    </group>
  )
}

export const LowerRightCentralIncisor = () => {
  return (
    <>
    <div style={{ position: 'relative', width: '100%', height: '10vh' }}>
      <img 
        src="../assets/back_arrow.png" 
        alt="Back"
        onClick={() => (window.location = '/')}
        style={{
          position: 'absolute',
          top: '32px',
          left: '32px',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          zIndex: 100
        }}
      />
    </div>
      <Canvas style={{ width: '100%', height: '500%' }}>
        <CameraController />
        <ambientLight intensity={0.7} />
        <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]} />
        <Suspense fallback={null}>
          <RightLowerCentralIncisor />
        </Suspense>
      </Canvas>
      <div>Lower right central incisor</div>
      <ToothInformation toothNumber={41} />
    </>
  )
}
