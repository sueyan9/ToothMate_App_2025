import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// =====teeth components======

import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// =====teeth components======
import { LowerLeftCanine } from './components/Teeth/LowerLeftCanine';
import { LowerLeftCentralIncisor } from './components/Teeth/LowerLeftCentralIncisor';
import { LowerLeftFirstMolar } from './components/Teeth/LowerLeftFirstMolar';
import { LowerLeftFirstPremolar } from './components/Teeth/LowerLeftFirstPremolar';
import { LowerLeftLateralIncisor } from './components/Teeth/LowerLeftLateralIncisor';
import { LowerLeftSecondMolar } from './components/Teeth/LowerLeftSecondMolar';
import { LowerLeftSecondPremolar } from './components/Teeth/LowerLeftSecondPremolar';
import { LowerLeftWisdomTooth } from './components/Teeth/LowerLeftWisdomTooth';
import { LowerRightCanine } from './components/Teeth/LowerRightCanine';
import { LowerRightCentralIncisor } from './components/Teeth/LowerRightCentralIncisor';
import { LowerRightFirstMolar } from './components/Teeth/LowerRightFirstMolar';
import { LowerRightFirstPremolar } from './components/Teeth/LowerRightFirstPremolar';
import { LowerRightLateralIncisor } from './components/Teeth/LowerRightLateralIncisor';
import { LowerRightSecondMolar } from './components/Teeth/LowerRightSecondMolar';
import { LowerRightSecondPremolar } from './components/Teeth/LowerRightSecondPremolar';
import { LowerRightWisdomTooth } from './components/Teeth/LowerRightWisdomTooth';
import { UpperLeftCanine } from './components/Teeth/UpperLeftCanine';
import { UpperLeftCentralIncisor } from './components/Teeth/UpperLeftCentralIncisor';
import { UpperLeftFirstMolar } from './components/Teeth/UpperLeftFirstMolar';
import { UpperLeftFirstPremolar } from './components/Teeth/UpperLeftFirstPremolar';
import { UpperLeftLateralIncisor } from './components/Teeth/UpperLeftLateralIncisor';
import { UpperLeftSecondMolar } from './components/Teeth/UpperLeftSecondMolar';
import { UpperLeftSecondPremolar } from './components/Teeth/UpperLeftSecondPremolar';
import { UpperLeftWisdomTooth } from './components/Teeth/UpperLeftWisdomTooth';
import { UpperRightCanine } from './components/Teeth/UpperRightCanine';
import { UpperRightCentralIncisor } from './components/Teeth/UpperRightCentralIncisor';
import { UpperRightFirstMolar } from './components/Teeth/UpperRightFirstMolar';
import { UpperRightFirstPremolar } from './components/Teeth/UpperRightFirstPremolar';
import { UpperRightLateralIncisor } from './components/Teeth/UpperRightLateralIncisor';
import { UpperRightSecondMolar } from './components/Teeth/UpperRightSecondMolar';
import { UpperRightSecondPremolar } from './components/Teeth/UpperRightSecondPremolar';
import { UpperRightWisdomTooth } from './components/Teeth/UpperRightWisdomTooth';

// ====================== Component Imports ======================
import FilterMenu from './components/FilterMenu';
import { toothData } from './components/ToothData';
import teethData from './components/Util/toothData.json';
import WholeMouth from './components/WholeMouth';
import WholeMouthKid from './components/WholeMouthKid';

// Function to normalize treatment type strings to match material keys
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

// Updated function to get treatments from JSON data
function getUniqueTreatmentsByPeriod(period) {
  if (period === 'historical') {
    // Collect all unique historical treatments from JSON
    const treatmentSet = new Set();
    Object.values(teethData.teeth).forEach(tooth => {
      tooth.treatments.forEach(treatment => {
        const normalizedType = normalizeTreatmentType(treatment.type);
        if (normalizedType) {
          treatmentSet.add(normalizedType);
        }
      });
    });
    return Array.from(treatmentSet);
  }

  if (period === 'future') {
    // Collect all unique future treatments from JSON
    const treatmentSet = new Set();
    Object.values(teethData.teeth).forEach(tooth => {
      tooth.futuretreatments.forEach(treatment => {
        const normalizedType = normalizeTreatmentType(treatment.type);
        if (normalizedType) {
          treatmentSet.add(normalizedType);
        }
      });
    });
    return Array.from(treatmentSet);
  }

  // For 'all' mode, get treatments from static ToothData
  if (period === 'all') {
    const all = Object.values(toothData).map(t => t.treatment).filter(Boolean);
    return [...new Set(all)].filter(t => t !== 'normal' && t !== 'missing');
  }

  return [];
}

export default function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [mode, setMode] = useState(null);

  // Updated initial state - now defaults to 'all' instead of null
  const [activeTimePeriod, setActiveTimePeriod] = useState('all');

  // Updated handler function with auto-selection logic
  const handleTimePeriodSelect = (timePeriod) => {
    setActiveTimePeriod(timePeriod);

    if (timePeriod === 'historical' || timePeriod === 'future') {
      // Auto-select treatments available in the JSON data for this time period
      const treatments = getUniqueTreatmentsByPeriod(timePeriod);
      setSelectedTreatment(treatments);
    } else if (timePeriod === 'all') {
      // For all mode, you can choose to keep existing selections or clear them
      // Option 1: Clear selections
      setSelectedTreatment([]);

      // Option 2: Auto-select all treatments (uncomment if preferred)
      // const treatments = getUniqueTreatmentsByPeriod('all');
      // setSelectedTreatment(treatments);
    }
  };

  // Updated handleSelect to work with the new auto-selection logic
  const handleSelect = (key, autoSelectedTreatments = null) => {
    if (key === 'auto') {
      // Special case for auto-selection from time period buttons
      setSelectedTreatment(autoSelectedTreatments || []);
      return;
    }

    if (key === 'all') {
      // Select all treatments based on current mode
      const allTreatments = getUniqueTreatmentsByPeriod(activeTimePeriod);
      setSelectedTreatment(allTreatments);
    } else if (key === 'none') {
      setSelectedTreatment([]);
    } else {
      // Toggle individual treatment
      setSelectedTreatment(prev => {
        if (prev.includes(key)) {
          return prev.filter(k => k !== key);
        } else {
          return [...prev.filter(k => k !== 'none'), key];
        }
      });
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const parentParam = query.get('parent');

    if (parentParam === null) {
      setMode('parent');
      setCurrentUser({ parent: true });
      return;
    }

    const isParent = parentParam !== 'false';
    setMode(isParent ? 'parent' : 'child');
    setCurrentUser({ parent: isParent });

  }, []);

  return (
    <div>
      <Router>
        <div className="container">
          <Routes>
            <Route
              exact path="/"
              element={
                <div className='top-icon'>
                  {!showMenu && (
                    <div className='top-icon-text'
                      onClick={e => {
                        e.stopPropagation();
                        setShowMenu(true);
                      }}
                    >
                      ☰
                    </div>
                  )}
                  <div className="container">
                    <div
                      className={`filter-menu-container ${showMenu ? 'active' : ''}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FilterMenu
                        selected={selectedTreatment}
                        onSelect={handleSelect}
                        isOpen={showMenu}
                        activeTimePeriod={activeTimePeriod}
                        onTimePeriodSelect={handleTimePeriodSelect}
                      />
                    </div>
                    <div className="main-3d"
                      onClick={() => setShowMenu(false)}
                      style={{ cursor: showMenu ? 'pointer' : 'default' }}
                    >
                      {currentUser ? (
                        mode === 'child' ? (
                          <WholeMouthKid selectedTreatment={selectedTreatment} />
                        ) : (
                          <WholeMouth
                            selectedTreatment={selectedTreatment}
                            setSelectedTreatment={setSelectedTreatment}
                            activeTimePeriod={activeTimePeriod}
                          />
                        )
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>


                  </div>
                </div>
              }
            />

            {/* LOWER LEFT */}
            <Route path="/lower-left-wisdom" element={<LowerLeftWisdomTooth />} />
            <Route path="/lower-left-second-molar" element={<LowerLeftSecondMolar />} />
            <Route path="/lower-left-first-molar" element={<LowerLeftFirstMolar />} />
            <Route path="/lower-left-second-premolar" element={<LowerLeftSecondPremolar />} />
            <Route path="/lower-left-first-premolar" element={<LowerLeftFirstPremolar />} />
            <Route path="/lower-left-canine" element={<LowerLeftCanine />} />
            <Route path="/lower-left-lateral-incisor" element={<LowerLeftLateralIncisor />} />
            <Route path="/lower-left-central-incisor" element={<LowerLeftCentralIncisor />} />

            {/* LOWER RIGHT */}
            <Route path="/lower-right-wisdom" element={<LowerRightWisdomTooth />} />
            <Route path="/lower-right-second-molar" element={<LowerRightSecondMolar />} />
            <Route path="/lower-right-first-molar" element={<LowerRightFirstMolar />} />
            <Route path="/lower-right-second-premolar" element={<LowerRightSecondPremolar />} />
            <Route path="/lower-right-first-premolar" element={<LowerRightFirstPremolar />} />
            <Route path="/lower-right-canine" element={<LowerRightCanine />} />
            <Route path="/lower-right-lateral-incisor" element={<LowerRightLateralIncisor />} />
            <Route path="/lower-right-central-incisor" element={<LowerRightCentralIncisor />} />

            {/* UPPER LEFT */}
            <Route path="/upper-left-wisdom" element={<UpperLeftWisdomTooth />} />
            <Route path="/upper-left-second-molar" element={<UpperLeftSecondMolar />} />
            <Route path="/upper-left-first-molar" element={<UpperLeftFirstMolar />} />
            <Route path="/upper-left-second-premolar" element={<UpperLeftSecondPremolar />} />
            <Route path="/upper-left-first-premolar" element={<UpperLeftFirstPremolar />} />
            <Route path="/upper-left-canine" element={<UpperLeftCanine />} />
            <Route path="/upper-left-lateral-incisor" element={<UpperLeftLateralIncisor />} />
            <Route path="/upper-left-central-incisor" element={<UpperLeftCentralIncisor />} />

            {/* UPPER RIGHT */}
            <Route path="/upper-right-wisdom" element={<UpperRightWisdomTooth />} />
            <Route path="/upper-right-second-molar" element={<UpperRightSecondMolar />} />
            <Route path="/upper-right-first-molar" element={<UpperRightFirstMolar />} />
            <Route path="/upper-right-second-premolar" element={<UpperRightSecondPremolar />} />
            <Route path="/upper-right-first-premolar" element={<UpperRightFirstPremolar />} />
            <Route path="/upper-right-canine" element={<UpperRightCanine />} />
            <Route path="/upper-right-lateral-incisor" element={<UpperRightLateralIncisor />} />
            <Route path="/upper-right-central-incisor" element={<UpperRightCentralIncisor />} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}