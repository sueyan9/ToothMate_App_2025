import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EducationScreen from './EducationScreen';
import { act } from 'react-test-renderer';

// Group of test cases for the <EducationScreen /> component
describe('EducationScreen', () => {

    // Test case 1: Ensure the title and all filter pills are rendered correctly
    it('renders title and filter pills', async () => {
        const { getByTestId, getAllByText } = render(<EducationScreen />);
        // Check if the title element with testID "education-title" exists
        expect(getByTestId('education-title')).toBeTruthy();
        // Check for the existence of each filter pill by its label
        // 'All' should exist and be rendered as a Text element
        expect(getAllByText('All')).toEqual(expect.arrayContaining([expect.any(Object)]));
        // These verify that other filters like 'Treatments', 'Conditions', and 'Oral Care' are rendered
        expect(getAllByText('Treatments')[0]).toBeTruthy();
        expect(getAllByText('Conditions')[0]).toBeTruthy();
        expect(getAllByText('Oral Care')[0]).toBeTruthy();
    });
// Test case 2: Simulate clicking on a filter pill and ensure it filters the content properly
    it('filters content when a filter is clicked', async () => {
        const { getByTestId, getAllByText } = render(<EducationScreen />);
        // Get the Treatments filter pill using its testID
        const filterBtn = getByTestId('filter-Treatments');
        // Simulate pressing the Treatments filter
        fireEvent.press(filterBtn);
        // Wait for content to update, then verify that "Treatments" topics are now visible
        await waitFor(() => {
            const topics = getAllByText('Treatments');
            expect(topics.length).toBeGreaterThan(0);
        });
    });
    // Test case 3: Simulate opening and closing a modal when a content card is clicked
    it('opens and closes the modal on content card click', async () => {
        const { getByTestId, getAllByText, queryByTestId} = render(<EducationScreen />);
        // Find and press the card with testID 'card-1' (Dental Hygiene topic)
        const card = getByTestId('card-1'); // Dental Hygiene
        // Wait for the modal content (with topic 'Dental Hygiene') to appear
        await act(async () => {
            fireEvent.press(card);
        });

        await waitFor(() => {
            expect(getAllByText('Dental Hygiene').length).toBeGreaterThan(0);
        });


        // Get the close button inside the modal and press it
        const closeButton = getByTestId('close-modal-btn');
        await act(async () => {
            fireEvent.press(closeButton);
        });

        // Wait for the modal to either be unmounted or set to invisible
        await waitFor(() => {
            const modal = queryByTestId('content-modal');
            // If the Modal is unmounted, it will be null; otherwise, check if 'visible' is false
            expect(!modal || modal.props.visible === false).toBe(true);
        });
    });
});