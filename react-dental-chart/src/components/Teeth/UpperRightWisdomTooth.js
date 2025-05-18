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

const UpperRightWisdom = ({ ...props }) => {
  const group = useRef()

  const { nodes, materials } = useGLTF('/assets/Right_Upper_Wisdom.glb')

  const middleFront = 'blue'
  const middle = 'red'
  const middleBack = 'pink'
  const middleLeft = 'purple'
  const middleRight = 'green'
  
  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[0.03, -1.45, -0.03]} rotation={[Math.PI / 2, 0, 0.06]} scale={0.74}>
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003.geometry}
          material={materials['1']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_4.geometry}
          material={materials['2']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_5.geometry}
          material={materials['3']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_6.geometry}
          material={materials['4']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_7.geometry}
          material={materials['5']}
          material-color={'red'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_8.geometry}
          material={materials['6']}
          material-color={'pink'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_9.geometry}
          material={materials['7']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_10.geometry}
          material={materials['8']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_11.geometry}
          material={materials['9']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_12.geometry}
          material={materials['10']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_13.geometry}
          material={materials['11']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_14.geometry}
          material={materials['12']}
          material-color={'purple'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_15.geometry}
          material={materials['13']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_16.geometry}
          material={materials['14']}
          material-color={'blue'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_17.geometry}
          material={materials['15']}
          material-color={'pink'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_18.geometry}
          material={materials['16']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_19.geometry}
          material={materials['17']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_20.geometry}
          material={materials['18']}
          material-color={'green'}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_21.geometry}
          material={materials['19']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_22.geometry}
          material={materials['20']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_23.geometry}
          material={materials['21']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_24.geometry}
          material={materials['22']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_25.geometry}
          material={materials['23']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_26.geometry}
          material={materials['24']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_27.geometry}
          material={materials['25']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_28.geometry}
          material={materials['26']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_29.geometry}
          material={materials['27']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_1.geometry}
          material={materials['28']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_2.geometry}
          material={materials['29']}
        />
        <mesh
          geometry={nodes.Human_Teeth_Upper_Third_Molar_Wisdom_Geo003_3.geometry}
          material={materials['30']}
        />
      </group>
    </group>
  )
}

export const UpperRightWisdomTooth = () => {
  return (
    <>
      <Canvas>
        <CameraController />
        <ambientLight intensity={0.7} />
        <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]} />
        <Suspense fallback={null}>
          <UpperRightWisdom />
        </Suspense>
      </Canvas>
      <div>Clicked on upper right wisdom tooth</div>
    </>
  )
}
