import { useEffect, useState } from "react";

export default function FilterMenu({
                                       onSelect,
                                       isOpen,
                                       activeTimePeriod,
                                       onTimePeriodSelect

                                   }) {

    const treatmentMap = {
        "Root Canal": "root-canal",
        "Crown Placement": "crown",
        "Filling": "filling",
        "Extraction": "extraction",
        "Bridge": "bridge",
        "Implant": "implant",
        "Veneer": "veneer",
        "Sealant": "sealant",
        "Cleaning": null,
        "Checkup": null,
    };

    const allTreatments = Object.keys(treatmentMap).filter(t => treatmentMap[t] !== null);

    const getAvailableTreatments = (period) => {
        if (period === "all") {
            return allTreatments;
        }
        if (period === "historical") {
            return ["Filling", "Extraction", "Root Canal"];
        }
        if (period === "future") {
            return ["Crown Placement", "Implant", "Veneer"];
        }
        return [];
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
        <div className={`filter-menu ${isOpen ? 'active' : ''}`}>
            <div className="filter-title">☰ Select Treatments</div>

            <div style={{ display: "flex", flexDirection: "row", overflowX: "auto", marginBottom: 16 }}>
                {["all", "historical", "future"].map((period) => (
                    <button
                        key={period}
                        style={filterStyle(period)}
                        onClick={() => onTimePeriodSelect && onTimePeriodSelect(period)}
                    >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                ))}
            </div>

            <div>
                <strong>Treatments ({activeTimePeriod})</strong>
                <ul>
                    {getAvailableTreatments(activeTimePeriod).length > 0 ? (
                        getAvailableTreatments(activeTimePeriod).map((t) => (
                            <li
                                key={t}
                                onClick={() => onSelect && onSelect({ period: activeTimePeriod, treatment: t })}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: 'transparent',
                                    padding: '5px',
                                    borderRadius: '3px',
                                    margin: '2px 0',
                                    listStyle: 'none'
                                }}
                            >
                                {t}
                            </li>
                        ))
                    ) : (
                        <li>No treatments</li>
                    )}
                </ul>
            </div>

            {/* Add select button */}
            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={() => onSelect && onSelect('all')}
                    style={{
                        padding: '8px 16px',
                        margin: '5px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Select All
                </button>
                <button
                    onClick={() => onSelect && onSelect('none')}
                    style={{
                        padding: '8px 16px',
                        margin: '5px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Clear All
                </button>
            </div>
        </div>
    );
}