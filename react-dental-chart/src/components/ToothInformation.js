
import { useContext, useEffect, useState } from "react";
import { Context as DentalContext } from "../context/DentalContext/DentalContext";

export default function ToothInformation({ toothNumber }) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    state: {teethData, loading, currentNHI},
    getToothInfo
  } = useContext(DentalContext);

  const toothInfo = getToothInfo(toothNumber, teethData);

    const latestTreatmentType = (arr = []) => {
        if (!Array.isArray(arr) || arr.length === 0) return null;
        if (typeof arr[0] === 'string') return arr[0];
        return [...arr]
          .sort((a, b) => new Date(b?.date || 0) - new Date(a?.date || 0))[0]?.type ?? null;
      };
  const onToggle = () => setIsOpen(!isOpen);

    // 👉 When the individual tooth panel opens, notify React Native
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

  const handleViewAppointments = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'VIEW_APPOINTMENTS',
        toothName: toothInfo.name,
        treatments: toothInfo.treatments
      }));
      
    }
  };

  if (loading) {
    return (
      <div className="tooth-info loading">
        <div className="tooth-info-header">
          Loading tooth {toothNumber}...
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
              <strong>Previous Work Done</strong>
              {toothInfo.treatments.length > 0 ? (
                <>
                  <ul className="treatment-list">
                    {toothInfo.treatments.map((treatment, index) => (
                      <li key={index} className="treatment-item">
                        <div>{treatment.date}</div>
                        <div>{treatment.type}</div>
                        <div>{treatment.notes}</div>
                      </li>
                    ))}
                  </ul>

                  {/*  Show edu button if treatments exist */}
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
                    Learn More
                  </button>

                  {/*  Show appointments button if treatments exist */}
                  <button
                    style={{
                      padding: '10px 20px',
                      background: '#2196F3',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginTop: '10px',
                      marginLeft: '10px'
                    }}
                    onClick={handleViewAppointments}
                  >
                    View Appointments
                  </button>
                </>
              ) : (
                <p>No previous treatments recorded for this tooth.</p>
              )}
            </div>

            <br>
            </br>

            <div>
              <strong>Planned Work To Do</strong>
              {toothInfo.futuretreatments.length > 0 ? (
                <ul className="treatment-list">
                  {toothInfo.futuretreatments.map((treatment, index) => (
                    <li key={index} className="treatment-item">
                      <div>{treatment.date}</div>
                      <div>{treatment.type}</div>
                      <div>{treatment.notes}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No planned treatments recorded for this tooth.</p>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
}