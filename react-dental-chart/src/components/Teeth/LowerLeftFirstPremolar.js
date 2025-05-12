import React, { useRef, Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useGLTF } from '@react-three/drei'

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

const LeftLowerFirstPremolar = ({ ...props }) => {
  const group = useRef()

  const { nodes, materials } = useGLTF('/assets/Left_Lower_First_Premolar.glb')

  return (
    <group ref={group} {...props} dispose={null}>
      {' '}
      <group position={[0, -1.56, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.58}>
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_1.geometry}
          material={materials['1']}
          material-color={'lightblue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_2.geometry}
          material={materials['2']}
          material-color={'lightblue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_3.geometry}
          material={materials['3']}
          material-color={'lightblue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_4.geometry}
          material={materials['4']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_5.geometry}
          material={materials['5']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_6.geometry}
          material={materials['6']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_7.geometry}
          material={materials['7']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_8.geometry}
          material={materials['8']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_9.geometry}
          material={materials['9']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_10.geometry}
          material={materials['10']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_11.geometry}
          material={materials['11']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_12.geometry}
          material={materials['12']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_13.geometry}
          material={materials['13']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_14.geometry}
          material={materials['14']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_15.geometry}
          material={materials['15']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_16.geometry}
          material={materials['16']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_17.geometry}
          material={materials['17']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_18.geometry}
          material={materials['18']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_19.geometry}
          material={materials['19']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_20.geometry}
          material={materials['20']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_21.geometry}
          material={materials['21']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_22.geometry}
          material={materials['22']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_23.geometry}
          material={materials['23']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_24.geometry}
          material={materials['24']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_25.geometry}
          material={materials['25']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_26.geometry}
          material={materials['26']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_27.geometry}
          material={materials['27']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_28.geometry}
          material={materials['28']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_29.geometry}
          material={materials['29']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Premolar_30.geometry}
          material={materials['30']}
        />
      </group>
    </group>
  )
}

export const LowerLeftFirstPremolar = () => {
  return (
    <>
      <Canvas>
        <CameraController />
        <ambientLight intensity={0.7} />
        <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]} />
        <Suspense fallback={null}>
          <LeftLowerFirstPremolar />
        </Suspense>
      </Canvas>
      <div>Clicked on lower left first premolar</div>
    </>
  )
}
