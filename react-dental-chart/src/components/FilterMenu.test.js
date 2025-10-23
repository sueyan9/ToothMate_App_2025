import { fireEvent, render } from '@testing-library/react';
import FilterMenu from './FilterMenu';

test('calls onSelect with "all" when Show All is clicked', () => {
  const onSelect = jest.fn();
  const { getByRole } = render(
    <FilterMenu
      selected={[]}                // empty -> shows "Show all Treatments"
      onSelect={onSelect}
      isOpen
      activeTimePeriod="all"
      onTimePeriodSelect={jest.fn()}
      treatmentsByPeriod={{ historical: [], future: [] }}
    />
  );

  fireEvent.click(getByRole('button', { name: /show all treatments/i }));
  expect(onSelect).toHaveBeenCalledWith('all');
});

test('calls onSelect with "none" when Clear All is clicked', () => {
  const onSelect = jest.fn();
  const { getByRole } = render(
    <FilterMenu
      selected={['filling']}       // non-empty -> shows "Clear All Treatments"
      onSelect={onSelect}
      isOpen
      activeTimePeriod="all"
      onTimePeriodSelect={jest.fn()}
      treatmentsByPeriod={{ historical: [], future: [] }}
    />
  );

  fireEvent.click(getByRole('button', { name: /clear all treatments/i }));
  expect(onSelect).toHaveBeenCalledWith('none');
});
