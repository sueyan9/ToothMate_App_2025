import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import FilterMenu from './FilterMenu';

jest.mock('./Treatment', () => ({
    TREATMENTS: [
        { key: 'a', label: 'A', colour: 'red' },
        { key: 'b', label: 'B', colour: 'blue' },
    ],
}));

describe('FilterMenu', () => {
    it('renders all treatment items', () => {
        const { getByText } = render(<FilterMenu selected={[]} onSelect={() => {}} />);
        expect(getByText('A')).toBeInTheDocument();
        expect(getByText('B')).toBeInTheDocument();
    });

    it('calls onSelect when a treatment is clicked', () => {
        const onSelect = jest.fn();
        const { getByText } = render(<FilterMenu selected={[]} onSelect={onSelect} />);
        fireEvent.click(getByText('A'));
        expect(onSelect).toHaveBeenCalledWith('a');
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