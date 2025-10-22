import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import ToothInformation from './ToothInformation';

jest.mock('./Util/toothData.json', () => ({
    teeth: {
        11: {
            name: "Upper Right Central Incisor",
            treatments: [
                {
                    date: "2023-01-01",
                    type: "Filling",
                    notes: "Composite filling added."
                }
            ],
            futuretreatments: [
                {
                    date: "2023-04-01",
                    type: "Root Canal",
                    notes: "Root canal treatment scheduled."
                }
            ]
        },
        34: {
            name: "Lower Left First Molar",
            treatments: [
                {
                    date: "2023-02-15",
                    type: "Extraction",
                    notes: "Tooth extracted due to decay."
                }
            ],
            futuretreatments: [
            ]
        },
        27: {
            name: "Upper Left Second Molar",
            treatments: [],
            futuretreatments: [
                {
                    date: "2023-06-01",
                    type: "Root Canal",
                    notes: "Root canal treatment scheduled."
                }
            ]
        },
        44: {
            name: "Lower Right First Premolar",
            treatments: [],
            futuretreatments: []
        }
    }
}));

describe('ToothInformation', () => {
    it('renders closed state initially', () => {
        render(<ToothInformation toothNumber={11} />);
        expect(screen.queryByText('Historical Treatments')).not.toBeInTheDocument();
    });

    it('toggles information panel on click', () => {
        render(<ToothInformation toothNumber={11} />);
        const header = screen.getByText('↑ Upper Right Central Incisor');

        //open
        fireEvent.click(header);
        expect(screen.getByText('↓ Upper Right Central Incisor (#11)')).toBeInTheDocument();

        //close
        fireEvent.click(header);
        expect(screen.getByText('↑ Upper Right Central Incisor')).toBeInTheDocument();
    });

    it('closes when click outside', () => {
        render(<ToothInformation toothNumber={11} />);
        const header = screen.getByText('↑ Upper Right Central Incisor');

        fireEvent.click(header);
        expect(screen.getByText('Historical Treatments')).toBeInTheDocument();

        fireEvent.click(document.body);
        expect(screen.queryByText('Historical Treatments')).not.toBeInTheDocument();
    });

    it('does not close when clicking inside the panel', () => {
        render(<ToothInformation toothNumber={11} />);
        const header = screen.getByText('↑ Upper Right Central Incisor');

        fireEvent.click(header);
        const panel = screen.getByText('Historical Treatments').closest('div');

        fireEvent.click(panel);
        expect(screen.getByText('Historical Treatments')).toBeInTheDocument();
    });

    it('displays correct information', () => {
        render(<ToothInformation toothNumber={11} />);
        fireEvent.click(screen.getByText('↑ Upper Right Central Incisor'));

        expect(screen.getByText('↓ Upper Right Central Incisor (#11)')).toBeInTheDocument();
        expect(screen.getByText('Composite filling added.')).toBeInTheDocument();
        expect(screen.getByText('Root canal treatment scheduled.')).toBeInTheDocument();
    });

    it('handles teeth with no treatments', () => {
        render(<ToothInformation toothNumber={44} />);
        fireEvent.click(screen.getByText('↑ Lower Right First Premolar'));

        expect(screen.getByText('↓ Lower Right First Premolar (#44)')).toBeInTheDocument();
        expect(screen.getByText('No treatments recorded for this tooth.')).toBeInTheDocument();
        expect(screen.getByText('No future treatments recorded for this tooth.')).toBeInTheDocument();
    });

    it('handles teeth with only future treatments', () => {
        render(<ToothInformation toothNumber={27} />);
        fireEvent.click(screen.getByText('↑ Upper Left Second Molar'));

        expect(screen.getByText('↓ Upper Left Second Molar (#27)')).toBeInTheDocument();
        expect(screen.getByText('No treatments recorded for this tooth.')).toBeInTheDocument();
        expect(screen.queryByText('No future treatments recorded for this tooth.')).not.toBeInTheDocument();
    });

    it('handles teeth with only treatments', () => {
        render(<ToothInformation toothNumber={34} />);
        fireEvent.click(screen.getByText('↑ Lower Left First Molar'));

        expect(screen.getByText('↓ Lower Left First Molar (#34)')).toBeInTheDocument();
        expect(screen.queryByText('No treatments recorded for this tooth.')).not.toBeInTheDocument();
        expect(screen.getByText('No future treatments recorded for this tooth.')).toBeInTheDocument();
    });

    it('shows default name if tooth not found', () => {
        render(<ToothInformation toothNumber={99} />);
        fireEvent.click(screen.getByText('↑ Tooth 99'));

        expect(screen.getByText('↓ Tooth 99 (#99)')).toBeInTheDocument();
    });
});