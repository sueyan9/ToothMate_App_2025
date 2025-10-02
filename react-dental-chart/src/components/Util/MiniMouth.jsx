import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo } from 'react'
import { Bounds } from '@react-three/drei'
import { useGLTF } from '@react-three/drei'

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

    // Highlight and dim material presets
    const highlight = useMemo(() => ({ color: '#ff9900', emissive: '#ff9900', emissiveIntensity: 0.6 }), [])
    const dim = useMemo(() => ({ emissive: '#000000', emissiveIntensity: 0 }), [])

    useEffect(() => {
        // Reset all meshes’ emissive properties before applying new highlight
        scene.traverse((o) => {
            if (o.isMesh && o.material) {
                const m = o.material.clone?.() || o.material
                if ('emissive' in m) {
                    m.emissive?.set?.(dim.emissive)
                    m.emissiveIntensity = dim.emissiveIntensity
                }
                o.material = m
            }
        })

        // Find the target tooth node from the mapping
        const nodeName = FDI_TO_NODE[targetToothNumber]
        if (!nodeName) {
            console.warn('FDI mapping missing for', targetToothNumber)
            return
        }

        // 1) Try exact node name first
        let target = scene.getObjectByName(nodeName)

        // 2) Fallback: try regex matching tooth number from mesh name
        if (!target) {
            const fdiNum = String(targetToothNumber)
            scene.traverse((o) => {
                if (!target && o.isMesh && /\d+/.test(o.name || '')) {
                    const numFromName = (o.name.match(/\d+/) || [])[0]
                    if (numFromName === fdiNum) target = o
                }
            })
        }

        if (!target || !target.isMesh) {
            console.warn('Target tooth mesh not found for', targetToothNumber, 'nodeName:', nodeName)
            return
        }

        // Apply highlight: clone material and update color/emissive
        const mat = target.material?.clone?.() || target.material
        if (mat) {
            mat.color?.set?.(highlight.color)
            if ('emissive' in mat) {
                mat.emissive?.set?.(highlight.emissive)
                mat.emissiveIntensity = highlight.emissiveIntensity
            }
            target.material = mat
        }
    }, [scene, targetToothNumber, highlight, dim])

    return <primitive object={scene} />
}

useGLTF.preload(WHOLE_MOUTH_GLB)
