// ====================== React Imports ======================
import { useState,useEffect } from 'react';
import {  BrowserRouter as Router, Routes , Route} from 'react-router-dom';
// =====teeth components======
import { LowerLeftCanine } from './components/Teeth/LowerLeftCanine'
import { LowerLeftCentralIncisor } from './components/Teeth/LowerLeftCentralIncisor'
import { LowerLeftFirstMolar } from './components/Teeth/LowerLeftFirstMolar'
import { LowerLeftFirstPremolar } from './components/Teeth/LowerLeftFirstPremolar'
import { LowerLeftLateralIncisor } from './components/Teeth/LowerLeftLateralIncisor'
import { LowerLeftSecondMolar } from './components/Teeth/LowerLeftSecondMolar'
import { LowerLeftSecondPremolar } from './components/Teeth/LowerLeftSecondPremolar'
import { LowerLeftWisdomTooth } from './components/Teeth/LowerLeftWisdomTooth'
import { LowerRightCanine } from './components/Teeth/LowerRightCanine'
import { LowerRightCentralIncisor } from './components/Teeth/LowerRightCentralIncisor'
import { LowerRightFirstMolar } from './components/Teeth/LowerRightFirstMolar'
import { LowerRightFirstPremolar } from './components/Teeth/LowerRightFirstPremolar'
import { LowerRightLateralIncisor } from './components/Teeth/LowerRightLateralIncisor'
import { LowerRightSecondMolar } from './components/Teeth/LowerRightSecondMolar'
import { LowerRightSecondPremolar } from './components/Teeth/LowerRightSecondPremolar'
import { LowerRightWisdomTooth } from './components/Teeth/LowerRightWisdomTooth'
import { UpperLeftCanine } from './components/Teeth/UpperLeftCanine'
import { UpperLeftCentralIncisor } from './components/Teeth/UpperLeftCentralIncisor'
import { UpperLeftFirstMolar } from './components/Teeth/UpperLeftFirstMolar'
import { UpperLeftFirstPremolar } from './components/Teeth/UpperLeftFirstPremolar'
import { UpperLeftLateralIncisor } from './components/Teeth/UpperLeftLateralIncisor'
import { UpperLeftSecondMolar } from './components/Teeth/UpperLeftSecondMolar'
import { UpperLeftSecondPremolar } from './components/Teeth/UpperLeftSecondPremolar'
import { UpperLeftWisdomTooth } from './components/Teeth/UpperLeftWisdomTooth'
import { UpperRightCanine } from './components/Teeth/UpperRightCanine'
import { UpperRightCentralIncisor } from './components/Teeth/UpperRightCentralIncisor'
import { UpperRightFirstMolar } from './components/Teeth/UpperRightFirstMolar'
import { UpperRightFirstPremolar } from './components/Teeth/UpperRightFirstPremolar'
import { UpperRightLateralIncisor } from './components/Teeth/UpperRightLateralIncisor'
import { UpperRightSecondMolar } from './components/Teeth/UpperRightSecondMolar'
import { UpperRightSecondPremolar } from './components/Teeth/UpperRightSecondPremolar'
import { UpperRightWisdomTooth } from './components/Teeth/UpperRightWisdomTooth'
// ====================== Component Imports ======================
import WholeMouth from './components/WholeMouth'
import WholeMouthKid from './components/WholeMouthKid';
import FilterMenu from './components/FilterMenu';

export default function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState([])
  const [currentUser, setCurrentUser] = useState(null);
  const [mode, setMode] = useState(null); // default is adult

// handle filter menu selection function
  const handleSelect = (key) => {
        if (key === 'all') {
    setSelectedTreatment([]);
  } else if (key === 'none') {
    setSelectedTreatment(['none']);
  } else {
    setSelectedTreatment(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      } else {
        return [...prev.filter(k => k !== 'none'), key];
      }
    });
  }
  };
// Parse query parameters to determine user type (parent/child)
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const parent = query.get('parent') === 'true';

    const user = {parent };

    setCurrentUser(user);
    setMode(parent ? 'parent' : 'child');
  }, []);

  //  Render the main 3D chart area
  const renderMainChart = () => {
    if (!currentUser || mode === null) {
      return <div>Loading 3D chart...</div>;
    }
    return (
        <div className="container">
          {showMenu && (
              <div className="filter-menu">
                <FilterMenu selected={selectedTreatment} onSelect={handleSelect} />
              </div>
          )}
          <div
              className="main-3d"
              onClick={() => setShowMenu(false)}
              style={{ cursor: showMenu ? 'pointer' : 'default' }}
          >
            {mode === 'child' ? (
                <WholeMouthKid selectedTreatment={selectedTreatment} />
            ) : (
                <WholeMouth
                    selectedTreatment={selectedTreatment}
                    setSelectedTreatment={setSelectedTreatment}
                />
            )}
          </div>
        </div>
    );
  };

// ======= Render =======
  return (
    <div>
      <Router>
        <div className="container">
          <Routes>
            {/* ========== Home Route (3D Mouth) ========== */}
            <Route
                exact path="/"
                element={
                  <div className='top-icon'>
                    {!showMenu && (
                          <div className='top-icon-text'
                              onClick={e => { e.stopPropagation(); setShowMenu(true); }}
                          >☰</div>
                          )}
                  <div className="container">
                    {showMenu && (
                    <div className="filter-menu">
                      <FilterMenu selected={selectedTreatment} onSelect={handleSelect}/>
                    </div>
                        )}
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

            {/* ========== Tooth Detail Routes ========== */}

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
