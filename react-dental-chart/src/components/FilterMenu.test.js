
import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import FilterMenu from './FilterMenu';

jest.mock('./Treatment', () => ({
    TREATMENTS: [
        { key: 'filling', label: 'Filling', colour: '#C00A0A' },
        { key: 'crown', label: 'Crown', colour: '#FF5100' },
    ],
}));

describe('FilterMenu', () => {
    it('renders all treatment items', () => {
        const { getByText } = render(<FilterMenu selected={[]} onSelect={() => {}} />);
        expect(getByText('Filling')).toBeInTheDocument();
        expect(getByText('Crown')).toBeInTheDocument();

    });

    it('calls onSelect when a treatment is clicked', () => {
        const onSelect = jest.fn();
        const { getByText } = render(<FilterMenu selected={[]} onSelect={onSelect} />);

        fireEvent.click(getByText('Filling'));
        expect(onSelect).toHaveBeenCalledWith('filling');

    });

    it('calls onSelect with "all" when Show All is clicked', () => {
        const onSelect = jest.fn();
        const { getByText } = render(<FilterMenu selected={[]} onSelect={onSelect} />);

        fireEvent.click(getByText('Show All'));

        expect(onSelect).toHaveBeenCalledWith('all');
    });

    it('calls onSelect with "none" when Clear All Filters is clicked', () => {
        const onSelect = jest.fn();
        const { getByText } = render(<FilterMenu selected={[]} onSelect={onSelect} />);

        fireEvent.click(getByText('Clear All Filters'));
        expect(onSelect).toHaveBeenCalledWith('none');
    });
});

