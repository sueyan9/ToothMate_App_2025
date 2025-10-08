import { useEffect, useState } from "react";
import { TREATMENTS } from './Treatment';

export default function FilterMenu({
                                     selected,
                                     onSelect,
                                     isOpen,
                                     activeTimePeriod,
                                     onTimePeriodSelect,
                                     treatmentsByPeriod,
                                     availableTreatmentKeys
                                   }) {
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

  // 获取可用的治疗类型
  const getAvailableTreatments = (timePeriod) => {
    const treatmentSet = new Set();
    const arr = treatmentsByPeriod[timePeriod] || [];

    arr.forEach(t => {
      const normalizedType = normalizeTreatmentType(t.treatmentType);
      if (normalizedType) {
        treatmentSet.add(normalizedType);
      }
    });
    const result = Array.from(treatmentSet);
    return result;
  };

  const normalizeTreatmentType = (treatmentType) => {
    const typeMap = {
      // 'Root Canal': 'rootCanal',
      'Crown Placement': 'crown',
      'Filling': 'filling',
      'Extraction': 'extraction',
      'Bridge': 'bridge',
      'Implant': 'implant',
      'Veneer': 'veneer',
      'Sealant': 'sealant',
      'root_canal': 'root_canal',
      'crown': 'crown',
      'filling': 'filling',
      'extraction': 'extraction',
      'bridge': 'bridge',
      'implant': 'implant',
      'veneer': 'veneer',
      'sealant': 'sealant',
      // no change
      'Cleaning': null,
      'Checkup': null
    };
    return typeMap[treatmentType] || treatmentType?.toLowerCase();
  };

  const handleSelect = () => {
    console.log('FilterMenu handleSelect called, selected.length:', selected.length);
    if (selected.length === 0) {
      onSelect('all');
    } else {
      onSelect('none');
    }
  };

  const handleTimePeriodSelect = (timePeriod) => {
    onTimePeriodSelect(timePeriod);

    if (timePeriod === 'historical' || timePeriod === 'future') {
      const availableTreatments = getAvailableTreatments(timePeriod);
      // Only select treatments that are available in the JSON data
      const validTreatments = availableTreatments.filter(treatment =>
          TREATMENTS.some(t => t.key === treatment)
      );
      console.log('Valid treatments for', timePeriod, ':', validTreatments);
      onSelect('auto', validTreatments);
    } else {
      onSelect('none');
    }
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
      fontStyle: hasData ? 'normal' : 'italic',
      cursor: hasData ? 'pointer' : 'not-allowed'
    };
  };

  // 初始加载时自动选择 historical treatments
  useEffect(() => {
    if (activeTimePeriod === 'historical' && treatmentsByPeriod?.historical?.length > 0) {
      const availableTreatments = getAvailableTreatments('historical');
      // Only select treatments that are available in the JSON data
      const validTreatments = availableTreatments.filter(treatment =>
          TREATMENTS.some(t => t.key === treatment)
      );

      if (validTreatments.length > 0 && selected.length === 0) {
        console.log('Initial load: historical treatments:', validTreatments);
        onSelect('auto', validTreatments);
      }
    }
  }, [activeTimePeriod, treatmentsByPeriod?.historical]);

  // 获取当前选中的治疗类型信息
  const getSelectedTreatmentsInfo = () => {
    return selected.map(key => {
      const treatment = TREATMENTS.find(t => t.key === key);
      return treatment ? {
        key: treatment.key,
        label: treatment.label,
        colour: treatment.colour
      } : null;
    }).filter(Boolean);
  };

  const selectedTreatmentsInfo = getSelectedTreatmentsInfo();

  return (
      <div className={`filter-menu ${isOpen ? 'active' : ''}`}>
        <div className="filter-title">Selected Treatments</div>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          paddingBottom: 8,
          justifyContent: 'center'
        }}>
          <div className="time-period-filters">
            <button
                style={getFilterStyle('historical')}
                onClick={() => handleTimePeriodSelect('historical')}
                testid="filter-historical"
            >
              My Mouth
            </button>
            <button
                style={getFilterStyle('future')}
                onClick={() => handleTimePeriodSelect('future')}
                testid="filter-future"
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
                    }}>
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