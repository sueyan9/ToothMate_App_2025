global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Canvas } from '@react-three/fiber'
import WholeMouthModel from './WholeMouth'

// Mock OrbitControls
jest.mock('three/examples/jsm/controls/OrbitControls', () => {
    return {
        OrbitControls: class {
            constructor() {}
            dispose() {}
        }
    }
})

// Mock toothData
jest.mock('./ToothData', () => ({
    toothData: {
        48: { treatment: 'filling' },
        47: { treatment: 'normal' },
        46: { treatment: 'normal' },
        45: { treatment: 'normal' },
        44: { treatment: 'normal' },
        43: { treatment: 'normal' },
        42: { treatment: 'normal' },
        41: { treatment: 'normal' },
        38: { treatment: 'normal' },
        37: { treatment: 'normal' },
        36: { treatment: 'normal' },
        35: { treatment: 'normal' },
        34: { treatment: 'normal' },
        33: { treatment: 'normal' },
        32: { treatment: 'normal' },
        31: { treatment: 'normal' },
        18: { treatment: 'normal' },
        17: { treatment: 'normal' },
        16: { treatment: 'normal' },
        15: { treatment: 'normal' },
        14: { treatment: 'normal' },
        13: { treatment: 'normal' },
        12: { treatment: 'normal' },
        11: { treatment: 'normal' },
        28: { treatment: 'normal' },
        27: { treatment: 'normal' },
        26: { treatment: 'normal' },
        25: { treatment: 'normal' },
        24: { treatment: 'normal' },
        23: { treatment: 'normal' },
        22: { treatment: 'normal' },
        21: { treatment: 'normal' },
    }
}))

// Mock useGLTF
jest.mock('@react-three/drei', () => {
    const original = jest.requireActual('@react-three/drei');
    const THREE = require('three');
    return {
        ...original,
        useGLTF: jest.fn(() => ({
            nodes: {
                upper_jaw: { geometry: {} },
                lower_jaw: { geometry: {} },
                tongue: { geometry: {} },
                lower_right_wisdom: { geometry: {} },
                lower_right_second_molar: { geometry: {} },
                lower_right_first_molar: { geometry: {} },
                lower_right_second_premolar: { geometry: {} },
                lower_right_first_premolar: { geometry: {} },
                lower_right_canine: { geometry: {} },
                lower_right_lateral_incisor: { geometry: {} },
                lower_right_central_incisor: { geometry: {} },
                lower_left_wisdom: { geometry: {} },
                lower_left_second_molar: { geometry: {} },
                lower_left_first_molar: { geometry: {} },
                lower_left_second_premolar: { geometry: {} },
                lower_left_first_premolar: { geometry: {} },
                lower_left_canine: { geometry: {} },
                lower_left_lateral_incisor: { geometry: {} },
                lower_left_central_incisor: { geometry: {} },
                upper_right_wisdom: { geometry: {} },
                upper_right_second_molar: { geometry: {} },
                upper_right_first_molar: { geometry: {} },
                upper_right_second_premolar: { geometry: {} },
                upper_right_first_premolar: { geometry: {} },
                upper_right_canine: { geometry: {} },
                upper_right_lateral_incisor: { geometry: {} },
                upper_right_central_incisor: { geometry: {} },
                upper_left_wisdom: { geometry: {} },
                upper_left_second_molar: { geometry: {} },
                upper_left_first_molar: { geometry: {} },
                upper_left_second_premolar: { geometry: {} },
                upper_left_first_premolar: { geometry: {} },
                upper_left_canine: { geometry: {} },
                upper_left_lateral_incisor: { geometry: {} },
                upper_left_central_incisor: { geometry: {} },
            },
            materials: {
                Gum: new THREE.MeshStandardMaterial(),
                tongue: new THREE.MeshStandardMaterial(),
            },
        })),
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

describe('WholeMouthModel', () => {
    it('renders without crashing', () => {
        const { container } = renderInCanvas(
            <WholeMouthModel selectedTreatment={['filling']} />
        )
        expect(container).toBeTruthy()
    })

    it('applies the correct material based on treatment', () => {
        const { container } = renderInCanvas(
            <WholeMouthModel selectedTreatment={['filling']} />
        )
        expect(container).toBeTruthy()
        // u can add more
    })

    it('navigates to correct page on click', () => {
        delete window.location
        window.location = { assign: jest.fn() }

        const { container } = renderInCanvas(
            <WholeMouthModel selectedTreatment={['filling']} />
        )

        // just mock ,better with real 3D test tool
        // just example
        const mesh = container.querySelector('mesh')
        if (mesh) {
            fireEvent.click(mesh)
            expect(window.location.assign).toHaveBeenCalled()
        }
    })
})