import { TREATMENTS } from './Treatment';
import teethData from './Util/toothData.json';

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
      <div className="filter-title">☰ Select Treatments</div>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 16,
        overflowX: 'auto', // Allows horizontal scrolling
        whiteSpace: 'nowrap', // Prevents buttons from wrapping
        paddingBottom: 10 // Adds space for the scrollbar
      }}>
        <button
          style={getFilterStyle('all')}
          onClick={() => handleTimePeriodSelect('all')}
          testID="filter-all"
        >
          All
        </button>
        <button
          style={getFilterStyle('historical')}
          onClick={() => handleTimePeriodSelect('historical')}
          testID="filter-historical"
        >
          Historical
        </button>
        <button
          style={getFilterStyle('future')}
          onClick={() => handleTimePeriodSelect('future')}
          testID="filter-future"
        >
          Future
        </button>
      </div>


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
              display: 'inline-block',
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: item.colour,
              marginRight: 8,
              border: isSelected ? '2px solid #333333' : '2px solid transparent',
              boxSizing: 'border-box',
<<<<<<< HEAD
              opacity: itemStyle.opacity || 1
            }} />
            <span className="filter-label" style={{
              color: isSelected ? '#333' : '#656B69',
              ...itemStyle
            }}>
=======
            }} />
            <span className="filter-label" style={{ color: isSelected ? '#333' : '#656B69' }}>
>>>>>>> master
              {item.label}
            </span>
          </div>
        );
      })}
<<<<<<< HEAD

      <div className="filter-item" onClick={() => onSelect('all')}>
        <span className="filter-label" style={{ color: selected.length === 0 ? '#333' : '#656B69' }}>
          Show All Treatments
        </span>
      </div>
      <div className="filter-item" onClick={() => onSelect('none')}>
        <span className="filter-label" style={{ color: '#656B69' }}>
          Clear All Treatments
        </span>
=======
      <div className="filter-item" onClick={() => onSelect('all')}>

        <span className="filter-label" style={{ color: selected.length === 0 ? '#333' : '#656B69' }}>Show All Treatments</span>
      </div>

      <div className="filter-item" onClick={() => onSelect('none')}>
        <span className="filter-label" style={{ color: '#656B69' }}>Clear All Treatments</span>

>>>>>>> master
      </div>
    </div>
  );
}