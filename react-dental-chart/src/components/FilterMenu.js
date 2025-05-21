import { TREATMENTS } from './Treatment';

export default function FilterMenu({selected, onSelect}) {

    return (
        <div className="filter-menu">
            <div className="filter-title">☰ Filter</div>
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
        <span className="filter-label" style={{ color: selected.length === 0 ? '#333' : '#656B69' }}>Show All</span>
      </div>

      <div className="filter-item" onClick={() => onSelect('none')}>
        <span className="filter-label" style={{ color: '#656B69' }}>Clear All Filters</span>
      </div>
    </div>
  );
}