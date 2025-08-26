import { useEffect, useState } from "react";

export default function ToothInformation({ toothNumber, allTeeth, allTreatments }) {
  const [isOpen, setIsOpen] = useState(false);
  const [toothInfo, setToothInfo] = useState(null);

  const latestTreatmentType = (arr = []) => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    if (typeof arr[0] === 'string') return arr[0];
    return [...arr]
        .sort((a, b) => new Date(b?.date || 0) - new Date(a?.date || 0))[0]?.type ?? null;
  };

  const onToggle = () => setIsOpen(!isOpen);

  // Process data when component mounts or data changes
  useEffect(() => {
    if (!allTeeth || !allTreatments || !toothNumber) return;

    // Find the specific tooth by tooth_number
    const tooth = allTeeth.find(t => t.tooth_number === toothNumber);

    if (tooth) {

      // Get treatments for this specific tooth
      const toothTreatments = allTreatments.filter(t => t.tooth_number === tooth.tooth_number);

      // Separate historical and future treatments
      const now = new Date();
      const historicalTreatments = [];
      const futureTreatments = [];

      toothTreatments.forEach(treatment => {
        const treatmentDate = treatment.treatmentDate || treatment.plannedFor;
        if (treatmentDate) {
          const date = new Date(treatmentDate);
          if (date <= now) {
            // Historical treatment
            historicalTreatments.push({
              date: treatmentDate,
              type: treatment.treatmentType,
              notes: treatment.treatmentDetails || '',
              status: treatment.status
            });
          } else {
            // Future treatment
            futureTreatments.push({
              date: treatmentDate,
              type: treatment.treatmentType,
              notes: treatment.treatmentDetails || '',
              status: treatment.status
            });
          }
        }
      });

      // Sort treatments by date
      historicalTreatments.sort((a, b) => new Date(b.date) - new Date(a.date));
      futureTreatments.sort((a, b) => new Date(a.date) - new Date(b.date));

      setToothInfo({
        name: tooth.name,
        treatments: historicalTreatments,
        futuretreatments: futureTreatments,
        toothId: tooth._id,
        location: tooth.location,
        type: tooth.type
      });
    } else {
      // Fallback if tooth not found
      setToothInfo({
        name: `Tooth ${toothNumber}`,
        treatments: [],
        futuretreatments: []
      });
    }
  }, [allTeeth, allTreatments, toothNumber]);

  // Notify React Native when tooth panel opens
  useEffect(() => {
    if (!isOpen || !toothInfo || !window.ReactNativeWebView) return;

    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'TOOTH_SELECTED',
      payload: {
        toothNumber,
        toothName: toothInfo.name,
        treatments: toothInfo.treatments ?? [],
        treatment: latestTreatmentType(toothInfo.treatments),
      }
    }));
  }, [isOpen, toothInfo, toothNumber]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) setIsOpen(false);
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  const handleViewEducation = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'VIEW_EDUCATION',
        toothName: toothInfo.name,
        treatments: toothInfo.treatments
      }));
    }
  };

  // Show loading state while data is being processed
  if (!allTeeth || !allTreatments) {
    return (
        <div className="tooth-info">
          <div className="tooth-info-header">
            Loading tooth information...
          </div>
        </div>
    );
  }

  if (!toothInfo) return null;

  return (
      <div className={`tooth-info ${isOpen ? 'active' : ''}`} onClick={onToggle}>
        <div onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }} className="tooth-info-header">
          {isOpen ? `↓ ${toothInfo.name} (#${toothNumber})` : `↑ ${toothInfo.name}`}
        </div>

        {isOpen && (
            <div onClick={handlePanelClick}>
              <div className="tooth-info-content">
                <div>
                  <strong>Historical Treatments</strong>
                  {toothInfo.treatments.length > 0 ? (
                      <>
                        <ul className="treatment-list">
                          {toothInfo.treatments.map((treatment, index) => (
                              <li key={index} className="treatment-item">
                                <div>{treatment.date}</div>
                                <div>{treatment.type}</div>
                                <div>{treatment.notes}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                  Status: {treatment.status}
                                </div>
                              </li>
                          ))}
                        </ul>

                        {/* Show education button if treatments exist */}
                        <button
                            style={{
                              padding: '10px 20px',
                              background: '#4CAF50',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              marginTop: '10px'
                            }}
                            onClick={handleViewEducation}
                        >
                          View Education
                        </button>
                      </>
                  ) : (
                      <p>No treatments recorded for this tooth.</p>
                  )}
                </div>

                <br />

                <div>
                  <strong>Future Treatments</strong>
                  {toothInfo.futuretreatments.length > 0 ? (
                      <ul className="treatment-list">
                        {toothInfo.futuretreatments.map((treatment, index) => (
                            <li key={index} className="treatment-item">
                              <div>{treatment.date}</div>
                              <div>{treatment.type}</div>
                              <div>{treatment.notes}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                Status: {treatment.status}
                              </div>
                            </li>
                        ))}
                      </ul>
                  ) : (
                      <p>No future treatments recorded for this tooth.</p>
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
  );
}