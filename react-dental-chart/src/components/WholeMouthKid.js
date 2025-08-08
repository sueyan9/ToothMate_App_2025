import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';


const WholeMouthKidModel = (props) => {
    const group = useRef();
    const { nodes, materials  } = useGLTF('/assets/version3.glb');

    // just shows mesh
    return (
        <group ref={group} {...props} dispose={null}>
            {Object.entries(nodes).map(([key, node]) => {

                if (node.type !== 'Mesh') return null;
                 return (

                    <mesh
                        key={key}
                        geometry={node.geometry.clone()}
                        position={node.position}
                        rotation={node.rotation}
                        scale={node.scale}
                    >
                <meshStandardMaterial color="#dddddd" />
                    </mesh>
                );
            })}
        </group>
    );
};
export default function WholeMouthKid() {
    return (
        <div className='mouth-container'>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[0, 10, 10]} intensity={0.5} />
                <Suspense fallback={null}>
                    <WholeMouthKidModel />
                </Suspense>
                <OrbitControls
                    minDistance={2}
                    maxDistance={10}
                    maxPolarAngle={Math.PI * 0.9}
                    minPolarAngle={0}
                    enablePan={false}
                />
            </Canvas>
            <p className='mouth-instructions mouth-info'>Tap and drag to interact with the mouth. Tap a tooth to view further details.</p>
        </div>
    );
}