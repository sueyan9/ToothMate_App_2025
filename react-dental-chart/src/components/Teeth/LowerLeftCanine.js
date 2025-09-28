import { useGLTF } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useState, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ToothInformation from '../ToothInformation';

const CameraController = () => {
  const { camera, gl } = useThree();

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.minDistance = 3;
    controls.maxDistance = 4;

    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  return null;
};

const LeftLowerCanine = ({ ...props }) => {
  const group = useRef();
  const { nodes, materials } = useGLTF('/assets/Left_Lower_Canine.glb');

  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[0, -1.54, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.68}>
        {Array.from({ length: 31 }, (_, i) => {
          const index = i + 1;
          const geometryName =
            index === 3
              ? 'Human_Teeth_Lower_Canine002_3'
              : `Human_Teeth_Lower_Canine002_${index}`;
          return (
            nodes[geometryName] && materials[`${i}`] && (
              <mesh
                key={index}
                geometry={nodes[geometryName].geometry}
                material={materials[`${i}`]}
              />
            )
          );
        })}
      </group>
    </group>
  );
};

export const LowerLeftCanine = () => {

    const [teethData, setTeethData] = useState([]);
    const [treatmentsData, setTreatmentsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // read data from URL
        const urlParams = new URLSearchParams(window.location.search);
        const teethParam = urlParams.get('teeth');
        const treatmentsParam = urlParams.get('treatments');

        if (teethParam && treatmentsParam) {
            try {
                const teeth = JSON.parse(decodeURIComponent(teethParam));
                const treatments = JSON.parse(decodeURIComponent(treatmentsParam));

                setTeethData(teeth);
                setTreatmentsData(treatments);
                setIsLoading(false);

            } catch (err) {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return <div>Loading tooth data...</div>;
    }


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

        <Canvas style={{ width: '100%', height: '80%' }}>
          <CameraController />
          <ambientLight intensity={0.7} />
          <spotLight intensity={1} angle={0.2} penumbra={1} position={[10, 15, 10]} />
          <Suspense fallback={null}>
            <LeftLowerCanine />
          </Suspense>
        </Canvas>
      </div>

      <ToothInformation
          toothNumber={33}
          allTeeth={teethData}
          allTreatments={treatmentsData}
      />
    </>
  );
};
