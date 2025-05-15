import { useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import React, { Suspense, useEffect, useRef } from 'react'
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

const RightUpperCanine = ({ ...props }) => {
  const group = useRef()

  const { nodes, materials } = useGLTF('/assets/Right_Upper_Canine.glb')

  // Colors for teethset (Rename according to dental charting standards)
  const middleFront = 'blue'
  const middleBack = 'pink'
  const middleLeft = 'purple'
  const middleRight = 'green'

  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[-0.01, -1.41, -0.01]} rotation={[Math.PI / 2, 0, 0.02]} scale={0.47}>
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_4.geometry}
          material={materials['1']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_5.geometry}
          material={materials['2']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_1.geometry}
          material={materials['3']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_6.geometry}
          material={materials['4']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_7.geometry}
          material={materials['5']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_8.geometry}
          material={materials['6']}
          material-color={'pink'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_9.geometry}
          material={materials['7']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_10.geometry}
          material={materials['8']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_11.geometry}
          material={materials['9']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_12.geometry}
          material={materials['10']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_13.geometry}
          material={materials['11']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_14.geometry}
          material={materials['12']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_15.geometry}
          material={materials['13']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_16.geometry}
          material={materials['14']}
          material-color={'pink'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_17.geometry}
          material={materials['15']}
          material-color={'pink'}

        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_18.geometry}
          material={materials['16']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_19.geometry}
          material={materials['17']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Canine_Geo004_20.geometry}
          material={materials['18']}
          material-color={'green'}
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
      <Canvas>
        <CameraController />
        <ambientLight intensity={0.7} />
        <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]} />
        <Suspense fallback={null}>
          <RightUpperCanine />
        </Suspense>
      </Canvas>
      <div>Clicked on upper right canine</div>
    </>
  )
}
