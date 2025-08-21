import { useEffect, useState } from "react";
import axios from "axios";

export default function ToothInformation({ toothId, toothName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [futureTreatments, setFutureTreatments] = useState([]);

  const onToggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (!toothId) return;

    const fetchTreatments = async () => {
      try {
        const res = await axios.get(`/treatments/tooth/${toothId}`);
        const data = res.data;

        const now = new Date();
        setTreatments(data.filter(t => new Date(t.treatmentDate) <= now));
        setFutureTreatments(data.filter(t => new Date(t.treatmentDate) > now));
      } catch (err) {
        console.error(err);
        setTreatments([]);
        setFutureTreatments([]);
      }
    };

    fetchTreatments();
  }, [toothId]);

  return (
      <div className={`tooth-info ${isOpen ? "active" : ""}`} onClick={onToggle}>
        <div className="tooth-info-header" onClick={e => { e.stopPropagation(); setIsOpen(!isOpen); }}>
          {isOpen ? `↓ ${toothName}` : `↑ ${toothName}`}
        </div>

        {isOpen && (
            <div onClick={e => e.stopPropagation()}>
              <strong>Historical Treatments</strong>
              {treatments.length > 0 ? (
                  <ul>
                    {treatments.map(t => (
                        <li key={t._id}>
                          {new Date(t.treatmentDate).toLocaleDateString()} - {t.stepName || t.treatmentType}
                        </li>
                    ))}
                  </ul>
              ) : <p>No treatments recorded.</p>}

              <strong>Future Treatments</strong>
              {futureTreatments.length > 0 ? (
                  <ul>
                    {futureTreatments.map(t => (
                        <li key={t._id}>
                          {new Date(t.treatmentDate).toLocaleDateString()} - {t.stepName || t.treatmentType}
                        </li>
                    ))}
                  </ul>
              ) : <p>No future treatments scheduled.</p>}
            </div>
        )}
      </div>
  );
}
