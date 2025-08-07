import { TREATMENTS } from './Treatment';

export default function FilterMenu({ selected, onSelect, isOpen, onTimePeriodSelect, activeTimePeriod }) {

  const getFilterStyle = (filterType) => ({
    backgroundColor: activeTimePeriod === filterType ? '#875B51' : 'transparent',
    color: activeTimePeriod === filterType ? 'white' : '#656B69',
    borderColor: activeTimePeriod === filterType ? '#875B51' : '#E0E0E0',
    borderWidth: 1,
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    marginRight: 10,
    fontWeight: 'bold',
    transition: 'all 0.3s ease-in-out',
  });

  return (
    <div className={`filter-menu ${isOpen ? 'active' : ''}`}>
      <div className="filter-title">☰ Select Treatments</div>

      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 16 }}>
        <button
          style={getFilterStyle('historical')}
          onClick={() => onTimePeriodSelect('historical')}
          testID="filter-historical"
        >
          Historical
        </button>
        <button
          style={getFilterStyle('future')}
          onClick={() => onTimePeriodSelect('future')}
          testID="filter-future"
        >
          Future
        </button>
      </div>

      {TREATMENTS.map(item => {
        const isSelected = selected.includes(item.key);
        return (
          <div key={item.key} className="filter-item" onClick={() => onSelect(item.key)}>
            <span style={{
              display: 'inline-block',
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: item.colour,
              marginRight: 8,
              border: isSelected ? '2px solid #333333' : '2px solid transparent',
              boxSizing: 'border-box',
            }} />
            <span className="filter-label" style={{ color: isSelected ? '#333' : '#656B69' }}>
              {item.label}
            </span>
          </div>
        );
      })}
      <div className="filter-item" onClick={() => onSelect('all')}>
        <span className="filter-label" style={{ color: selected.length === 0 ? '#333' : '#656B69' }}>Show All Treatments</span>
      </div>
      <div className="filter-item" onClick={() => onSelect('none')}>
        <span className="filter-label" style={{ color: '#656B69' }}>Clear All Treatments</span>
      </div>
    </div>
  );
}