// react-dental-chart/src/components/ToothInformation.test.js
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import ToothInformation from './ToothInformation';

// 🔧 Mock the display helpers so the header text matches test expectations
jest.mock('./Util/toothDisplay', () => ({
  formatDisplayNumber: (n) => n, // keep number as-is so "(#11)" etc. works
  getDisplayToothName: (n) => {
    const map = {
      11: 'Upper Right Central Incisor',
      27: 'Upper Left Second Molar',
      34: 'Lower Left First Molar',
      44: 'Lower Right First Premolar',
    };
    return map[n] ?? `Tooth ${n}`;
  },
}));

// ❌ Remove this entire mock block if it exists in your file — not used by the component anymore
// jest.mock('./Util/toothData.json', ...)

// Small helper to render with the right prop shape
const renderTooth = (num) => render(<ToothInformation toothInfo={{ toothNumber: num }} />);

// Helper to control URLSearchParams (userId/userNhi) so fetch may run
const setSearch = (search) => {
  const url = `http://localhost/${search ? `?${search.replace(/^\?/, '')}` : ''}`;
  window.history.pushState({}, '', url);
};

describe('ToothInformation', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    setSearch(''); // default: no userId/userNhi => no fetch, instant "no data" UI
  });

  it('renders closed state initially (after loading finishes)', async () => {
    renderTooth(11);
    const header = await screen.findByText('↑ Upper Right Central Incisor');
    expect(header).toBeInTheDocument();
  });

  it('toggles information panel on click', async () => {
    renderTooth(11);
    const headerClosed = await screen.findByText('↑ Upper Right Central Incisor');

    fireEvent.click(headerClosed);
    expect(screen.getByText('↓ Upper Right Central Incisor (#11)')).toBeInTheDocument();

    // click the open header to close
    fireEvent.click(screen.getByText('↓ Upper Right Central Incisor (#11)'));
    expect(screen.getByText('↑ Upper Right Central Incisor')).toBeInTheDocument();
  });

  it('does not close when clicking inside the panel', async () => {
    renderTooth(11);
    const header = await screen.findByText('↑ Upper Right Central Incisor');

    fireEvent.click(header); // open
    const panelSection = screen.getByText('Previous Work Done').closest('div');
    fireEvent.click(panelSection); // inside click should not close
    expect(screen.getByText('Previous Work Done')).toBeInTheDocument();
  });

  it('displays correct information when API returns historical & future data (with userId)', async () => {
    setSearch('?userId=abc'); // trigger fetch path

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        historical: [
          { date: '2023-01-01', treatmentType: 'Filling', notes: 'Composite filling added.' },
        ],
        future: [
          { date: '2023-04-01', treatmentType: 'Root Canal', notes: 'Root canal treatment scheduled.' },
        ],
      }),
    });

    renderTooth(11);
    const header = await screen.findByText('↑ Upper Right Central Incisor');
    fireEvent.click(header);

    expect(screen.getByText('↓ Upper Right Central Incisor (#11)')).toBeInTheDocument();
    expect(screen.getByText('Composite filling added.')).toBeInTheDocument();
    expect(screen.getByText('Root canal treatment scheduled.')).toBeInTheDocument();
  });

  it('handles teeth with no treatments', async () => {
    renderTooth(44);
    const header = await screen.findByText('↑ Lower Right First Premolar');
    fireEvent.click(header);

    expect(screen.getByText('↓ Lower Right First Premolar (#44)')).toBeInTheDocument();
    expect(screen.getByText('No previous treatments recorded for this tooth.')).toBeInTheDocument();
    expect(screen.getByText('No planned treatments recorded for this tooth.')).toBeInTheDocument();
  });

  it('handles teeth with only future treatments (no previous)', async () => {
    setSearch('?userId=abc');
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        historical: [],
        future: [
          { date: '2023-06-01', treatmentType: 'Root Canal', notes: 'Root canal treatment scheduled.' },
        ],
      }),
    });

    renderTooth(27);
    const header = await screen.findByText('↑ Upper Left Second Molar');
    fireEvent.click(header);

    expect(screen.getByText('↓ Upper Left Second Molar (#27)')).toBeInTheDocument();
    expect(screen.getByText('No previous treatments recorded for this tooth.')).toBeInTheDocument();
    expect(screen.queryByText('No planned treatments recorded for this tooth.')).not.toBeInTheDocument();
  });

  it('handles teeth with only previous treatments (no planned)', async () => {
    setSearch('?userId=abc');
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        historical: [
          { date: '2023-02-15', treatmentType: 'Extraction', notes: 'Tooth extracted due to decay.' },
        ],
        future: [],
      }),
    });

    renderTooth(34);
    const header = await screen.findByText('↑ Lower Left First Molar');
    fireEvent.click(header);

    expect(screen.getByText('↓ Lower Left First Molar (#34)')).toBeInTheDocument();
    expect(screen.queryByText('No previous treatments recorded for this tooth.')).not.toBeInTheDocument();
    expect(screen.getByText('No planned treatments recorded for this tooth.')).toBeInTheDocument();
  });

  it('shows default name if tooth not found', async () => {
    renderTooth(99);
    const header = await screen.findByText('↑ Tooth 99');
    fireEvent.click(header);
    expect(screen.getByText('↓ Tooth 99 (#99)')).toBeInTheDocument();
  });
});
