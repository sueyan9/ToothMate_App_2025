import React, { useRef, Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useGLTF } from '@react-three/drei'

const CameraController = () => {
  const { camera, gl } = useThree()

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement)

    controls.minDistance = 3
    controls.maxDistance = 6
    return () => {
      controls.dispose()
    }
  }, [camera, gl])
  return null
}

const WholeMouthModel = ({ ...props }) => {
  const group = useRef()

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
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-wisdom')}
      />
      <mesh
        geometry={nodes.lower_right_second_molar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-second-molar')}
      />
      <mesh
        geometry={nodes.lower_right_first_molar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-first-molar')}
      />
      <mesh
        geometry={nodes.lower_right_second_premolar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-second-premolar')}
      />
      <mesh
        geometry={nodes.lower_right_first_premolar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-first-premolar')}
      />
      <mesh
        geometry={nodes.lower_right_canine.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-canine')}
      />
      <mesh
        geometry={nodes.lower_right_lateral_incisor.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-lateral-incisor')}
      />
      <mesh
        geometry={nodes.lower_right_central_incisor.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-right-central-incisor')}
      />

      {/* LOWER LEFT */}

      <mesh
        geometry={nodes.lower_left_wisdom.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-wisdom')}
      />
      <mesh
        geometry={nodes.lower_left_second_molar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-second-molar')}
      />
      <mesh
        geometry={nodes.lower_left_first_molar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-first-molar')}
      />
      <mesh
        geometry={nodes.lower_left_second_premolar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-second-premolar')}
      />
      <mesh
        geometry={nodes.lower_left_first_premolar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-first-premolar')}
      />
      <mesh
        geometry={nodes.lower_left_canine.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-canine')}
      />
      <mesh
        geometry={nodes.lower_left_lateral_incisor.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-lateral-incisor')}
      />
      <mesh
        geometry={nodes.lower_left_central_incisor.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/lower-left-central-incisor')}
      />

      {/* UPPER RIGHT */}

      <mesh
        geometry={nodes.upper_right_wisdom.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-wisdom')}
      />
      <mesh
        geometry={nodes.upper_right_second_molar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-second-molar')}
      />
      <mesh
        geometry={nodes.upper_right_first_molar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-first-molar')}
      />
      <mesh
        geometry={nodes.upper_right_second_premolar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-second-premolar')}
      />
      <mesh
        geometry={nodes.upper_right_first_premolar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-first-premolar')}
      />
      <mesh
        geometry={nodes.upper_right_canine.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-canine')}
      />
      <mesh
        geometry={nodes.upper_right_lateral_incisor.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-lateral-incisor')}
      />
      <mesh
        geometry={nodes.upper_right_central_incisor.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-right-central-incisor')}
      />

      {/* UPPER LEFT */}

      <mesh
        geometry={nodes.upper_left_wisdom.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-wisdom')}
      />
      <mesh
        geometry={nodes.upper_left_second_molar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-second-molar')}
      />
      <mesh
        geometry={nodes.upper_left_first_molar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-first-molar')}
      />
      <mesh
        geometry={nodes.upper_left_second_premolar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-second-premolar')}
      />
      <mesh
        geometry={nodes.upper_left_first_premolar.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-first-premolar')}
      />
      <mesh
        geometry={nodes.upper_left_canine.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-canine')}
      />
      <mesh
        geometry={nodes.upper_left_lateral_incisor.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-lateral-incisor')}
      />
      <mesh
        geometry={nodes.upper_left_central_incisor.geometry}
        material={materials.Teeths}
        position={[0, 0.36, -0.29]}
        rotation={[1.11, 0, 0]}
        scale={39.99}
        onClick={() => (window.location = '/upper-left-central-incisor')}
      />
    </group>
  )
}

export default function WholeMouth() {
  return (
    <>
      <Canvas>
        <CameraController />
        <ambientLight intensity={0.7} />
        <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]} />
        <Suspense fallback={null}>
          <WholeMouthModel />
        </Suspense>
      </Canvas>
      <p>Tap and drag to interact with the mouth. Tap a tooth to view further details.</p>
    </>
  )
}
