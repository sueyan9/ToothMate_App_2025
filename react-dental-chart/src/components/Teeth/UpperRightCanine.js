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

const RightUpperCanine = ({ ...props }) => {
  const group = useRef()

  const { nodes, materials } = useGLTF('/assets/Right_Upper_Canine.glb')

  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[-0.01, -1.41, -0.01]} rotation={[Math.PI / 2, 0, 0.02]} scale={0.47}>
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_4.geometry}
          material={materials['1']}
          material-color={'lightgreen'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_5.geometry}
          material={materials['2']}
          material-color={'lightgreen'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_1.geometry}
          material={materials['3']}
          material-color={'lightgreen'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_6.geometry}
          material={materials['4']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_7.geometry}
          material={materials['5']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_8.geometry}
          material={materials['6']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_9.geometry}
          material={materials['7']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_10.geometry}
          material={materials['8']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_11.geometry}
          material={materials['9']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_12.geometry}
          material={materials['10']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_13.geometry}
          material={materials['11']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_14.geometry}
          material={materials['12']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_15.geometry}
          material={materials['13']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_16.geometry}
          material={materials['14']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_17.geometry}
          material={materials['15']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_18.geometry}
          material={materials['16']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_19.geometry}
          material={materials['17']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_20.geometry}
          material={materials['18']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_21.geometry}
          material={materials['19']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_22.geometry}
          material={materials['20']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_23.geometry}
          material={materials['21']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_24.geometry}
          material={materials['22']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_25.geometry}
          material={materials['23']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_26.geometry}
          material={materials['24']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_27.geometry}
          material={materials['25']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_28.geometry}
          material={materials['26']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_29.geometry}
          material={materials['27']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_30.geometry}
          material={materials['28']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_2.geometry}
          material={materials['29']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_3.geometry}
          material={materials['30']}
        />
      </group>
    </group>
  )
}

export const UpperRightCanine = () => {
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
          <RightUpperCanine />
        </Suspense>
      </Canvas>
      <div>Upper right canine</div>
      <ToothInformation toothNumber={13} />
    </>
  )
}
