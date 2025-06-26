import { useEffect, useState } from "react";
import teethData from './toothData.json';

export default function ToothInformation({ toothNumber }) {
const [isOpen, setIsOpen] = useState(false);
const [toothInfo, setToothInfo] = useState(null);

const onToggle = () => setIsOpen(!isOpen);

useEffect(() => {
    const tooth = teethData.teeth[toothNumber];
    setToothInfo(tooth || {
      name: `Tooth ${toothNumber}`,
      treatments: []
    });
  }, [toothNumber]);

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

  if (!toothInfo) return null;
  
  return (
    <div className={`tooth-info ${isOpen ? 'active' : ''}`} onClick={onToggle}>
      <div onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }} className="tooth-info-header">
        {isOpen ? '↓ More Information' : '↑ More Information'}
      </div>

      {isOpen && (
        <div onClick={handlePanelClick}>
          <div className="tooth-info-content">
          <h3>{toothInfo.name} (#{toothNumber})</h3>
          
          <div>
            <strong>Treatments</strong>
            {toothInfo.treatments.length > 0 ? (
              <ul className="treatment-list">
                {toothInfo.treatments.map((treatment, index) => (
                  <li key={index} className="treatment-item">
                    <div>{treatment.date}</div>
                    <div>{treatment.type}</div>
                    <div>{treatment.notes}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No treatments recorded for this tooth.</p>
            )}
          </div>

          </div>
        </div>
      )}
    </div>
  );
}