import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import FilterMenu from './FilterMenu';

describe('FilterMenu', () => {
    it('renders all treatment items', () => {
        const { getByText } = render(<FilterMenu selected={[]} onSelect={() => {}} />);
        expect(getByText('Root Canal')).toBeInTheDocument();
        expect(getByText('Filling')).toBeInTheDocument();
    });

    it('check if wrong treatment is not rendered', () => {
        const { queryByText } = render(<FilterMenu selected={[]} onSelect={() => {}} />);
        expect(queryByText('TOOTHWRONG')).not.toBeInTheDocument();
    });

    it('calls onSelect when a treatment is clicked', () => {
        const onSelect = jest.fn();
        const { getByText } = render(<FilterMenu selected={[]} onSelect={onSelect} />);
        fireEvent.click(getByText('Root Canal'));
        expect(onSelect).toHaveBeenCalledWith('rootCanal');
    });

    it('calls onSelect with "all" when Show All is clicked', () => {
        const onSelect = jest.fn();
        const { getByText } = render(<FilterMenu selected={[]} onSelect={onSelect} />);
        fireEvent.click(getByText('Show All Treatments'));
        expect(onSelect).toHaveBeenCalledWith('all');
    });

    it('calls onSelect with "none" when Clear All Filters is clicked', () => {
        const onSelect = jest.fn();
        const { getByText } = render(<FilterMenu selected={[]} onSelect={onSelect} />);
        fireEvent.click(getByText('Clear All Treatments'));
        expect(onSelect).toHaveBeenCalledWith('none');
    });
});
