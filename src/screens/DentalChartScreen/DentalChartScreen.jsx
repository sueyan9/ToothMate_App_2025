// import { StyleSheet, Text, View } from 'react-native';
// import { WebView } from 'react-native-webview'; // need npm install react-native-webview

// const DentalChartScreen = () => (
//     <View style={{ flex: 1 }}>
//       <Text style={styles.header}>3D Mouth Model</Text>
//       <WebView
//           source={{ uri: 'http://172.29.117.158:3001/' }} // H5 page url
//           style={{ flex: 1 }}
//       />
//     </View>
// );

// const styles = StyleSheet.create({
//   header: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
// });

// export default DentalChartScreen;

import { useGLTF } from '@react-three/drei/native';
import { Canvas } from '@react-three/fiber/native';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const TOOTH_KEYS = [
  'lower_right_central_incisor',
  'lower_right_first_molar',
  'lower_right_wisdom',
  'lower_right_second_molar',
  'lower_right_first_premolar',
  'lower_right_second_premolar',
  'lower_right_canine',
  'lower_right_lateral_incisor',
  'lower_left_central_incisor',
  'lower_left_first_molar',
  'lower_left_wisdom',
  'lower_left_second_molar',
  'lower_left_first_premolar',
  'lower_left_second_premolar',
  'lower_left_canine',
  'lower_left_lateral_incisor',
  'upper_right_first_premolar',
  'upper_right_wisdom',
  'upper_right_second_premolar',
  'upper_right_lateral_incisor',
  'upper_right_first_molar',
  'upper_right_second_molar',
  'upper_right_canine',
  'upper_right_central_incisor',
  'upper_left_central_incisor',
  'upper_left_first_premolar',
  'upper_left_wisdom',
  'upper_left_second_premolar',
  'upper_left_lateral_incisor',
  'upper_left_first_molar',
  'upper_left_second_molar',
  'upper_left_canine',
];

function MouthModel(props) {
  const { nodes, materials } = useGLTF(
    'https://dl.dropboxusercontent.com/scl/fi/hdyfg5q63xyyegb18vaom/adult_whole_mouth.glb?rlkey=zyni7qfw5uztz5bq665d2luac&st=82dl5v7h'
  );
  const [selectedPart, setSelectedPart] = useState(null);

  const handleClick = (name) => {
    setSelectedPart((prev) => (prev === name ? null : name));
  };

  const renderTooth = (name) => {
    if (!nodes[name]) return null;
    const isSelected = selectedPart === name;
    const isAnySelected = selectedPart !== null;
    return (
      <mesh
        key={name}
        geometry={nodes[name].geometry}
        material={materials.Teeths.clone()}
        position={[0, name.includes('upper') ? 0.36 : 0.36, name.includes('upper') ? -0.286 : -0.069]}
        rotation={[name.includes('upper') ? 1.109 : Math.PI, 0, 0]}
        scale={39.993}
        material-transparent={isAnySelected}
        material-opacity={isSelected ? 1 : isAnySelected ? 0.2 : 1}
        material-depthWrite={!isSelected}
        material-depthTest={!isSelected}
        renderOrder={isSelected ? 999 : 1}
        onClick={(e) => {
          e.stopPropagation();
          handleClick(name);
        }}
      />
    );
  };

  return (
    <group {...props} dispose={null}>
      {/* Gums */}
      <mesh
        geometry={nodes.upper_jaw.geometry}
        material={materials.Gum.clone()}
        position={[0, 0.36, -0.286]}
        rotation={[1.109, 0, 0]}
        scale={39.993}
        material-transparent={selectedPart !== null}
        material-opacity={selectedPart === 'upper_jaw' ? 1 : selectedPart ? 0.2 : 1}
        material-depthWrite={selectedPart !== 'upper_jaw'}
        material-depthTest={selectedPart !== 'upper_jaw'}
        renderOrder={selectedPart === 'upper_jaw' ? 999 : 1}
        onClick={(e) => {
          e.stopPropagation();
          handleClick('upper_jaw');
        }}
      />
      <mesh
        geometry={nodes.lower_jaw.geometry}
        material={materials.Gum.clone()}
        position={[0, 0.36, -0.069]}
        rotation={[Math.PI, 0, 0]}
        scale={39.993}
        material-transparent={selectedPart !== null}
        material-opacity={selectedPart === 'lower_jaw' ? 1 : selectedPart ? 0.2 : 1}
        material-depthWrite={selectedPart !== 'lower_jaw'}
        material-depthTest={selectedPart !== 'lower_jaw'}
        renderOrder={selectedPart === 'lower_jaw' ? 999 : 1}
        onClick={(e) => {
          e.stopPropagation();
          handleClick('lower_jaw');
        }}
      />
      {/* Tongue */}
      <mesh
        geometry={nodes.tongue.geometry}
        material={materials.tongue.clone()}
        position={[0, 0.36, -0.069]}
        rotation={[Math.PI, 0, 0]}
        scale={39.993}
        material-transparent={selectedPart !== null}
        material-opacity={selectedPart === 'tongue' ? 1 : selectedPart ? 0.2 : 1}
        material-depthWrite={selectedPart !== 'tongue'}
        material-depthTest={selectedPart !== 'tongue'}
        renderOrder={selectedPart === 'tongue' ? 999 : 1}
        onClick={(e) => {
          e.stopPropagation();
          handleClick('tongue');
        }}
      />
      {/* Teeth */}
      {TOOTH_KEYS.map(renderTooth)}
    </group>
  );
}

export default function DentalChartScreen() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>3D Mouth Model is not supported on web.</Text>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.header}>3D Mouth Model</Text>
      <Canvas style={{ flex: 1 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <MouthModel />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});