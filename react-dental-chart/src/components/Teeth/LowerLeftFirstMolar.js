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

const LeftLowerFirstMolar = ({ ...props }) => {
  const group = useRef()

  const { nodes, materials } = useGLTF('/assets/Left_Lower_First_Molar.glb')

  // Colors for teethset (Rename according to dental charting standards)
  const Top = 'blue'
  const Front = 'pink'
  const Back = 'purple'
  const Left = 'red'
  const Right = 'orange'
  const test = 'yellow'

  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[0, -1.48, 0]} rotation={[Math.PI / 2, 0, 1.4]} scale={0.5}>

        {/* left */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_2.geometry}
          material={materials['1']}
          material-color={Left}
        />
        {/* left */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_3.geometry}
          material={materials['2']}
          material-color={Left}
        />
        {/* left */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_4.geometry}
          material={materials['3']}
          material-color={Left}
        />
        {/* front */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_5.geometry}
          material={materials['4']}
          material-color={Front}
        />
        {/* top */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_6.geometry}
          material={materials['5']}
          material-color={Top}
        />
        {/* back */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_7.geometry}
          material={materials['6']}
          material-color={Back}
        />
        {/* right */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_8.geometry}
          material={materials['7']}
          material-color={Right}
        />
        {/* right */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_9.geometry}
          material={materials['8']}
          material-color={Right}
        />
        {/* right */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_10.geometry}
          material={materials['9']}
          material-color={Right}
        />
        {/* left */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_11.geometry}
          material={materials['10']}
          material-color={Left}
        />
        {/* left */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_12.geometry}
          material={materials['11']}
          material-color={Left}
        />
        {/* left */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_13.geometry}
          material={materials['12']}
          material-color={Left}
        />
        {/* front */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_14.geometry}
          material={materials['13']}
          material-color={Front}
        />
        {/* top */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_15.geometry}
          material={materials['14']}
          material-color={Top}
        />
        {/* back */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_16.geometry}
          material={materials['15']}
          material-color={Back}
        />
        {/* right */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_17.geometry}
          material={materials['16']}
          material-color={Right}
        />
        {/* right */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_18.geometry}
          material={materials['17']}
          material-color={Right}
        />
        {/* right */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_19.geometry}
          material={materials['18']}
          material-color={Right}
        />
        {/* left */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_20.geometry}
          material={materials['19']}
          material-color={Left}
        />
        {/* left */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_21.geometry}
          material={materials['20']}
          material-color={Left}
        />
        {/* left */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_22.geometry}
          material={materials['21']}
          material-color={Left}
        />
        {/* front */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_23.geometry}
          material={materials['22']}
          material-color={Front}
        />
        {/* dunno -----------------------------*/}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_24.geometry}
          material={materials['23']}
          material-color={test}
        />
        {/* back */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_25.geometry}
          material={materials['24']}
          material-color={Back}
        />
        {/* right */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_26.geometry}
          material={materials['25']}
          material-color={Right}
        />
        {/* right */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_27.geometry}
          material={materials['26']}
          material-color={Right}
        />
        {/* right */}
        <mesh
          geometry={nodes.Human_Teeth_Lower_First_Molar029_28.geometry}
          material={materials['27']}
          material-color={Right}
        />


        
        {/* roots */}
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
  return (
    <>
      <Canvas>
        <CameraController />
        <ambientLight intensity={0.7} />
        <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]} />
        <Suspense fallback={null}>
          <LeftLowerFirstMolar />
        </Suspense>
      </Canvas>
      <div>Clicked on lower left first molar</div>
    </>
  )
}
