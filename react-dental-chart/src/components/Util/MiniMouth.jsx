import { Bounds, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const WHOLE_MOUTH_GLB = `${process.env.PUBLIC_URL}/assets/adult_whole_mouth.glb`

// FDI tooth number to GLTF node name mapping
const FDI_TO_NODE = {
    // LOWER LEFT (30s)
    31: 'lower_left_central_incisor',
    32: 'lower_left_lateral_incisor',
    33: 'lower_left_canine',
    34: 'lower_left_first_premolar',
    35: 'lower_left_second_premolar',
    36: 'lower_left_first_molar',
    37: 'lower_left_second_molar',
    38: 'lower_left_wisdom',
    // LOWER RIGHT (40s)
    41: 'lower_right_central_incisor',
    42: 'lower_right_lateral_incisor',
    43: 'lower_right_canine',
    44: 'lower_right_first_premolar',
    45: 'lower_right_second_premolar',
    46: 'lower_right_first_molar',
    47: 'lower_right_second_molar',
    48: 'lower_right_wisdom',
    // UPPER LEFT (20s)
    21: 'upper_left_central_incisor',
    22: 'upper_left_lateral_incisor',
    23: 'upper_left_canine',
    24: 'upper_left_first_premolar',
    25: 'upper_left_second_premolar',
    26: 'upper_left_first_molar',
    27: 'upper_left_second_molar',
    28: 'upper_left_wisdom',
    // UPPER RIGHT (10s)
    11: 'upper_right_central_incisor',
    12: 'upper_right_lateral_incisor',
    13: 'upper_right_canine',
    14: 'upper_right_first_premolar',
    15: 'upper_right_second_premolar',
    16: 'upper_right_first_molar',
    17: 'upper_right_second_molar',
    18: 'upper_right_wisdom',
}

export default function MiniMouth({ targetToothNumber }) {
    return (
        <Canvas style={{ width: '100%', height: '100%' }} camera={{ fov: 35 }}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[2, 3, 5]} intensity={1.1} />
            <Suspense fallback={null}>
                <Bounds fit clip observe margin={1.1}>
                    <WholeMouthMiniModel targetToothNumber={targetToothNumber} />
                </Bounds>
            </Suspense>
        </Canvas>
    )
}

function WholeMouthMiniModel({ targetToothNumber }) {
    const { scene } = useGLTF(WHOLE_MOUTH_GLB)
    const sceneRef = useRef()
    const prevToothRef = useRef(null)

    // Create highlight material only
    const highlightMaterial = useMemo(() => {
        const material = new THREE.MeshStandardMaterial({
            color: '#ff9900',
            emissive: '#ff9900',
            emissiveIntensity: 0.6
        })
        return material
    }, [])

    // Store original materials for restoration
    const originalMaterials = useRef(new Map())

    useEffect(() => {
        if (!scene || !sceneRef.current) return

        // First, store all original materials if not already stored
        scene.traverse((object) => {
            if (object.isMesh && object.material && !originalMaterials.current.has(object.uuid)) {
                originalMaterials.current.set(object.uuid, object.material)
            }
        })

        // Reset all meshes to their original materials (no dim material)
        if (previousToothRef.current) {
            const originalMaterial = originalMaterials.current.get(previousToothRef.current.uuid)
            if (originalMaterial) {
                previousToothRef.current.material = originalMaterial
            }
            previousToothRef.current = null
        }

        // Find and highlight target tooth
        if (targetToothNumber) {
            const nodeName = FDI_TO_NODE[targetToothNumber]
            let targetMesh = null

            // Method 1: Try exact node name match
            if (nodeName) {
                targetMesh = scene.getObjectByName(nodeName)
            }

            // Method 2: Try regex matching tooth number from mesh name
            if (!targetMesh) {
                const fdiNum = String(targetToothNumber)
                scene.traverse((object) => {
                    if (!targetMesh && object.isMesh && object.name) {
                        // Check if the object name contains the FDI number
                        if (object.name.includes(fdiNum)) {
                            targetMesh = object
                        }
                        // Also try regex matching
                        const numMatch = object.name.match(/\d+/)
                        if (numMatch && numMatch[0] === fdiNum) {
                            targetMesh = object
                        }
                    }
                })
            }

            if (!targetMesh) {
                console.warn(`Could not find tooth mesh for FDI number ${targetToothNumber}`)
                // Log available mesh names for debugging
                const meshNames = []
                scene.traverse((object) => {
                    if (object.isMesh) {
                        meshNames.push(object.name)
                    }
                })
                console.log('Available mesh names:', meshNames)
            } else {
                // Apply highlight material to target tooth
                targetMesh.material = highlightMaterial.clone()
                console.log(`Highlighted tooth ${targetToothNumber} (${nodeName || 'unknown'})`)
            }
        }
    }, [scene, targetToothNumber, highlightMaterial])

    return <primitive ref={sceneRef} object={scene} />
}

useGLTF.preload(WHOLE_MOUTH_GLB)