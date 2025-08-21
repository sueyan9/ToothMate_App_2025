import { useEffect, useState } from "react";
import axios from "axios";

export default function FilterMenu({ toothId }) {
  const [allTreatments, setAllTreatments] = useState([]);
  const [activeTimePeriod, setActiveTimePeriod] = useState("all");

  // Fetch treatments from backend
  useEffect(() => {
    if (!toothId) return;

    const fetchTreatments = async () => {
      try {
        const res = await axios.get(`/treatments/tooth/${toothId}`);
        setAllTreatments(res.data || []);
      } catch (err) {
        console.error(err);
        setAllTreatments([]);
      }
    };

    void fetchTreatments();
  }, [toothId]);

  const normalizeTreatmentType = (type) => {
    const typeMap = {
      "Root Canal": "rootCanal",
      "Crown Placement": "crown",
      Filling: "filling",
      Extraction: "extraction",
      Bridge: "bridge",
      Implant: "implant",
      Veneer: "veneer",
      Sealant: "sealant",
      Cleaning: null,
      Checkup: null,
    };
    if (!type) return null;
    return typeMap[type] || type.toLowerCase();
  };

  const getAvailableTreatments = (period) => {
    const now = new Date();
    const filtered = allTreatments.filter((t) => {
      const date = new Date(t.treatmentDate);
      if (period === "historical") return date <= now;
      if (period === "future") return date > now;
      return true;
    });

    const setKeys = new Set();
    filtered.forEach((t) => {
      const key = normalizeTreatmentType(t.treatmentType || t.stepName);
      if (key) setKeys.add(key);
    });

    return Array.from(setKeys);
  };

  const handleTimePeriodSelect = (period) => {
    setActiveTimePeriod(period);
  };

  const filterStyle = (filterType) => ({
    backgroundColor: activeTimePeriod === filterType ? "#EDDFD3" : "transparent",
    color: "#333",
    border: "2.5px solid",
    borderColor: activeTimePeriod === filterType ? "#875B51" : "#516287",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    marginRight: 10,
    fontWeight: "bold",
  });

  return (
      <div className="filter-menu">
        <div className="filter-title">☰ Select Treatments</div>
        <div style={{ display: "flex", flexDirection: "row", overflowX: "auto", marginBottom: 16 }}>
          {["all", "historical", "future"].map((period) => (
              <button
                  key={period}
                  style={filterStyle(period)}
                  onClick={() => handleTimePeriodSelect(period)}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
          ))}
        </div>

        <div>
          <strong>Treatments ({activeTimePeriod})</strong>
          <ul>
            {getAvailableTreatments(activeTimePeriod).length > 0 ? (
                getAvailableTreatments(activeTimePeriod).map((t) => <li key={t}>{t}</li>)
            ) : (
                <li>No treatments</li>
            )}
          </ul>
        </div>
      </div>
  );
}
