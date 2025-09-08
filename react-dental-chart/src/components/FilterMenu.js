import { TREATMENTS } from './Treatment';
import teethData from './Util/toothData.json';

export default function FilterMenu({ selected, onSelect, isOpen, onTimePeriodSelect, activeTimePeriod }) {

  const getFilterStyle = (filterType) => ({
    backgroundColor: activeTimePeriod === filterType ? '#EDDFD3' : 'transparent',
    color: '#333333',
    borderColor: activeTimePeriod === filterType ? '#875B51' : '#516287',
    borderWidth: 2.5,
    padding: '8px 16px',
    borderStyle: 'solid',
    borderRadius: '20px',
    cursor: 'pointer',
    marginRight: 10,
    marginBottom: 0,
    fontWeight: 'bold',
    transition: 'all 0.3s ease-in-out',
    outline: 'none',
  });

  // Function to get unique treatments from JSON data for a specific time period
  const getAvailableTreatments = (timePeriod) => {
    const treatmentSet = new Set();

    Object.values(teethData.teeth).forEach(tooth => {
      const treatmentArray = timePeriod === 'historical'
        ? tooth.treatments
        : tooth.futuretreatments;

      treatmentArray.forEach(treatment => {
        // Normalize treatment types to match TREATMENTS keys
        const normalizedType = normalizeTreatmentType(treatment.type);
        if (normalizedType) {
          treatmentSet.add(normalizedType);
        }
      });
    });

    return Array.from(treatmentSet);
  };

  // Function to normalize treatment type strings to match TREATMENTS keys
  const normalizeTreatmentType = (treatmentType) => {
    const typeMap = {
      'Root Canal': 'rootCanal',
      'Crown Placement': 'crown',
      'Filling': 'filling',
      'Extraction': 'extraction',
      'Bridge': 'bridge',
      'Implant': 'implant',
      'Veneer': 'veneer',
      'Sealant': 'sealant',
      // Skip these as they don't affect tooth appearance
      'Cleaning': null,
      'Checkup': null
    };
    return typeMap[treatmentType] || treatmentType.toLowerCase();
  };

  const handleSelect = () => {
    if (selected.length === 0) {
      onSelect('all');
    } else {
      onSelect('none');
    }
  }

  // Handle time period selection with auto-filter selection
  const handleTimePeriodSelect = (timePeriod) => {
    onTimePeriodSelect(timePeriod);

    // Only auto-select for historical/future, not for 'all'
    if (timePeriod === 'historical' || timePeriod === 'future') {
      // Auto-select treatments available in the JSON data for this time period
      const availableTreatments = getAvailableTreatments(timePeriod);

      // Only select treatments that are available in the JSON data
      const validTreatments = availableTreatments.filter(treatment =>
        TREATMENTS.some(t => t.key === treatment)
      );

      // Auto-select these treatments
      onSelect('auto', validTreatments);
    }
    // For 'all' mode, don't auto-select - let user choose manually
  };

  // Get visual indicator of which treatments have data for current time period
  const getTreatmentItemStyle = (treatmentKey) => {
    if (!activeTimePeriod || activeTimePeriod === 'all') {
      return {};
    }

    const availableTreatments = getAvailableTreatments(activeTimePeriod);
    const hasData = availableTreatments.includes(treatmentKey);

    return {
      opacity: hasData ? 1 : 0.3,
      fontStyle: hasData ? 'normal' : 'italic'
    };
  };

  return (
    <div className={`filter-menu ${isOpen ? 'active' : ''}`}>
      <div className="filter-title">Selected Treatments</div>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'auto', // Allows horizontal scrolling
        whiteSpace: 'nowrap', // Prevents buttons from wrapping
        paddingBottom: 8 ,// Adds space for the scrollbar
        justifyContent: 'center'
      }}>
        <div className="time-period-filters">
        {/* <button
          style={getFilterStyle('all')}
          onClick={() => handleTimePeriodSelect('all')}
          testID="filter-all"
        >
          All
        </button> */}
        <button
          style={getFilterStyle('historical')}
          onClick={() => handleTimePeriodSelect('historical')}
          testID="filter-historical"
        >
          My Mouth
        </button>
        <button
          style={getFilterStyle('future')}
          onClick={() => handleTimePeriodSelect('future')}
          testID="filter-future"
        >
          Planned Work
        </button>
      </div>
      </div>

      <div className="treatment-filters">
        <div className="filter-grid">
      {TREATMENTS.map(item => {
        const isSelected = selected.includes(item.key);
        const itemStyle = getTreatmentItemStyle(item.key);

        return (
          <div
            key={item.key}
            className="filter-item"
            onClick={() => onSelect(item.key)}
            style={itemStyle}
          >
            <span style={{
              display: 'flex',
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: item.colour,
              marginRight: 8,
              boxSizing: 'border-box',
              opacity: itemStyle.opacity || 1,
              border: isSelected ? '7px solid rgba(255, 255, 255, 0.4)' : '2px solid transparent',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center'
            }} >
            {isSelected && (
              <span style={{
                color: '#333333',
                fontSize: '10px',
                fontWeight: 'bold',
                lineHeight: '1'
              }}>
                X
              </span>
            )}
            </span>
            <span className="filter-label" style={{
              color: isSelected ? '#333' : '#656B69',
              ...itemStyle
            }}>
              {item.label}
            </span>
          </div>
        );
      })}
        </div>
      </div>


      <div className="action-buttons">
      {/* <div className="filter-button" onClick={handleSelect}>
        <span className="filter-label" style={{ color: '#333' }}>
          {selected.length !== 0 ? 'Clear All Treatments' : 'Show all Treatments'}
        </span>
      </div> */}
      <div className="filter-button">
        <button
          className={`selection-button ${selected.length === 0 ? 'active' : ''}`}
          onClick={handleSelect}
        >
          {selected.length !== 0 ? 'Clear All Treatments' : 'Show all Treatments'}
        </button>
      </div>
    </div>
    </div>

  );
}