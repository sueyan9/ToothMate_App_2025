import { useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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

const LeftLowerLateralIncisor = ({ ...props }) => {
  const group = useRef()

  const { nodes, materials } = useGLTF('/assets/Left_Lower_Lateral_Incisor.glb')

  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[0, -1.63, 0]} rotation={[Math.PI / 2, 0, -0.09]} scale={0.76}>
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_1.geometry}
          material={materials['1']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_2.geometry}
          material={materials['2']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_3.geometry}
          material={materials['3']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_4.geometry}
          material={materials['4']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_5.geometry}
          material={materials['5']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_6.geometry}
          material={materials['6']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_7.geometry}
          material={materials['7']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_8.geometry}
          material={materials['8']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_9.geometry}
          material={materials['9']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_10.geometry}
          material={materials['10']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_11.geometry}
          material={materials['11']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_12.geometry}
          material={materials['12']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_13.geometry}
          material={materials['13']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_14.geometry}
          material={materials['14']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_15.geometry}
          material={materials['15']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_16.geometry}
          material={materials['16']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_17.geometry}
          material={materials['17']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_18.geometry}
          material={materials['18']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_19.geometry}
          material={materials['19']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_20.geometry}
          material={materials['20']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_21.geometry}
          material={materials['21']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_22.geometry}
          material={materials['22']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_23.geometry}
          material={materials['23']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_24.geometry}
          material={materials['24']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_25.geometry}
          material={materials['25']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_26.geometry}
          material={materials['26']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_27.geometry}
          material={materials['27']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_28.geometry}
          material={materials['28']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor_29.geometry}
          material={materials['29']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_Lateral_Incisor.geometry}
          material={materials['30']}
        />
      </group>
    </group>
  )
}

export const LowerLeftLateralIncisor = () => {
  return (
    <>
      <Canvas>
        <CameraController />
        <ambientLight intensity={0.7} />
        <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]} />
        <Suspense fallback={null}>
          <LeftLowerLateralIncisor />
        </Suspense>
      </Canvas>
      <div>Clicked on lower left lateral incisor</div>
    </>
  )
}
