import { useGLTF } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useMemo } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ToothInformation from '../ToothInformation';
import MiniMouth from '../Util/MiniMouth';

const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(() => {
        // Enable OrbitControls for zoom/rotation
        const controls = new OrbitControls(camera, gl.domElement);
        controls.minDistance = 3;
        controls.maxDistance = 4;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        return () => controls.dispose();
    }, [camera, gl]);
    return null;
};

const LeftLowerCanine = ({ ...props }) => {
    const group = useRef();
    const { nodes, materials } = useGLTF('/assets/Left_Lower_Canine.glb');

    return (
        <group ref={group} {...props} dispose={null}>
            <group position={[0, -1.54, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.68}>
                {/* IMPORTANT: geometry and material indices should match 1..30 */}
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_1?.geometry}  material={materials['1']}  />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_2?.geometry}  material={materials['2']}  />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_3?.geometry}  material={materials['3']}  />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_4?.geometry}  material={materials['4']}  />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_5?.geometry}  material={materials['5']}  />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_6?.geometry}  material={materials['6']}  />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_7?.geometry}  material={materials['7']}  />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_8?.geometry}  material={materials['8']}  />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_9?.geometry}  material={materials['9']}  />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_10?.geometry} material={materials['10']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_11?.geometry} material={materials['11']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_12?.geometry} material={materials['12']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_13?.geometry} material={materials['13']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_14?.geometry} material={materials['14']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_15?.geometry} material={materials['15']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_16?.geometry} material={materials['16']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_17?.geometry} material={materials['17']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_18?.geometry} material={materials['18']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_19?.geometry} material={materials['19']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_20?.geometry} material={materials['20']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_21?.geometry} material={materials['21']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_22?.geometry} material={materials['22']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_23?.geometry} material={materials['23']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_24?.geometry} material={materials['24']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_25?.geometry} material={materials['25']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_26?.geometry} material={materials['26']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_27?.geometry} material={materials['27']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_28?.geometry} material={materials['28']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_29?.geometry} material={materials['29']} />
                <mesh geometry={nodes.Human_Teeth_Lower_Canine002_30?.geometry} material={materials['30']} />
            </group>
        </group>
    );
};

useGLTF.preload('/assets/Left_Lower_Canine.glb');

export const LowerLeftCanine = () => {
    // Define basic information for this tooth
    const toothInfo = {
        toothNumber: 33,
        name: "Left Lower Canine",
        position: "Lower Jaw Left Side",
        type: "Canine",
        rootCount: 1,
        canalCount: 1
    };

    return (
        <>
            <div
                style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}
            >
        <div style={{ position: 'relative', width: '100%', height: '10vh' }}>
          <img
            src="../assets/back_arrow.png"
            alt="Back"
            onClick={() => (window.location = '/')}
            className='back-button'
          />
        </div>
                {/* Main 3D canvas - takes up the entire screen */}
                <Canvas style={{ width: '100%', height: '100%' }}>
                    <CameraController />
                    <ambientLight intensity={0.7} />
                    <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]} />
                    <Suspense fallback={null}>
                        <LeftLowerCanine />
                    </Suspense>
                </Canvas>

            {/* Mini mouth preview window */}
            <div
                style={{
                    position: 'absolute',
                    right: -20,
                    top: '5vh',
                    width: 120,
                    height: 120,
                    background: 'rgba(240, 248, 255, 0)',
                    borderRadius: 10,
                    boxShadow:'none', //'0 2px 6px rgba(0,0,0,0.1)',
                    padding: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(2px)',
                    zIndex: 1000,
                    pointerEvents: 'none',
                }}
            >
                <MiniMouth targetToothNumber={toothInfo.toothNumber} />
            </div>
        </div>
            {/* Pass the complete tooth information object */}
            <ToothInformation toothInfo={toothInfo} />
        </>
    );
};