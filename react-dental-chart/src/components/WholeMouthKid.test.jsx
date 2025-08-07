global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};
import { Canvas } from '@react-three/fiber';
import { render } from '@testing-library/react';
import WholeMouthKidModel from './WholeMouthKid';

// Mock OrbitControls
jest.mock('three/examples/jsm/controls/OrbitControls', () => {
    return {
        OrbitControls: class {
            constructor() {}
            dispose() {}
        }
    }
})

jest.mock('@react-three/drei', () => {
  const original = jest.requireActual('@react-three/drei');
  return {
    ...original,
    OrbitControls: jest.fn(() => <div data-testid="orbit-controls" />),
    useGLTF: jest.fn(() => ({
      nodes: {
        // Only mock essential nodes for movement testing
        'model.001': { type: 'Mesh', geometry: {}, position: [0,0,0] },
        'model.002': { type: 'Mesh', geometry: {}, position: [0,0,0] }
      },
      materials: {}
    }))
  };
});

// Helper to render component within a Canvas
const renderInCanvas = (ui) => {
    return render(
        <Canvas>
            <ambientLight />
            {ui}
        </Canvas>
    )
}

describe('WholeMouthKidModel', () => {
    it('renders without crashing', () => {
        const { container } = renderInCanvas(
            <WholeMouthKidModel />
        )
        expect(container).toBeTruthy()
    })
})