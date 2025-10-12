import { Bounds, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const WHOLE_MOUTH_GLB = `${process.env.PUBLIC_URL}/assets/adult_whole_mouth.glb`

// FDI tooth number to GLTF node name mapping
const FDI_TO_NODE = {
    // LOWER LEFT (30s))
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
        <Canvas key={targetToothNumber} style={{ width: '100%', height: '100%' }} camera={{ fov: 35 }}>
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
    const gltf = useGLTF(WHOLE_MOUTH_GLB)
    const [scene, setScene] = useState(null)
    const sceneRef = useRef()

    useEffect(() => {
        // Always clone the scene to get a fresh copy with original materials
        const clonedScene = gltf.scene.clone(true)
        
        // Highlight the target tooth
        if (targetToothNumber) {
            const nodeName = FDI_TO_NODE[targetToothNumber]
            let targetMesh = null

            if (nodeName) {
                targetMesh = clonedScene.getObjectByName(nodeName)
            }

            if (!targetMesh) {
                const fdiNum = String(targetToothNumber)
                clonedScene.traverse((object) => {
                    if (!targetMesh && object.isMesh && object.name) {
                        if (object.name.includes(fdiNum)) {
                            targetMesh = object
                        }
                        const numMatch = object.name.match(/\d+/)
                        if (numMatch && numMatch[0] === fdiNum) {
                            targetMesh = object
                        }
                    }
                })
            }

            if (targetMesh) {
                const highlightMaterial = new THREE.MeshStandardMaterial({
                    color: '#ff9900',
                    emissive: '#ff9900',
                    emissiveIntensity: 0.6
                })
                targetMesh.material = highlightMaterial
            }
        }

        setScene(clonedScene)
    }, [gltf.scene, targetToothNumber])

    return scene ? <primitive ref={sceneRef} object={scene} /> : null
}

useGLTF.preload(WHOLE_MOUTH_GLB)