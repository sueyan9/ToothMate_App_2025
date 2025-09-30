import { ArrowLeft } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
// ===== teeth components =====
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
import WholeMouth from './components/WholeMouth';
import WholeMouthKid from './components/WholeMouthKid';


const BackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isToothPage = location.pathname !== '/';
  if (!isToothPage) return null;
  return (
      <button
          onClick={() => navigate('/')}
          style={{ position: 'fixed', top: '130px', left: '24px', zIndex: 1000, padding: '10px 15px', backgroundColor: '#E9F1F8', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
          aria-label="Back"
      >
        <ArrowLeft size={24} color={'#333333'} />
      </button>
  );
};
export default function App() {
  const [userId] = useUserId();


  const [showMenu, setShowMenu] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState([]);
  const [mode, setMode] = useState(null); // 'parent' | 'child'
  const [activeTimePeriod, setActiveTimePeriod] = useState('historical'); // 'historical' | 'future'


  const [treatmentsByPeriod, setTreatmentsByPeriod] = useState({ historical: [], future: [] });
  const [eruptionLevels, setEruptionLevels] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const latestUserRef = useRef(null);


  const pull = useCallback(async (uid) => {
    setLoading(true); setError(''); latestUserRef.current = uid;
    try {
      const data = await fetchTreatmentsByUser(uid);
      if (latestUserRef.current !== uid) return; // avoid race
      setTreatmentsByPeriod({ historical: data.historical, future: data.future });
      if (data.eruptionLevels) setEruptionLevels(data.eruptionLevels);
      const keys = uniqueKeysFrom(activeTimePeriod === 'future' ? data.future : data.historical);
      setSelectedTreatment(keys);
    } catch (e) {
      setError(e && e.message ? e.message : 'Load failed');
    } finally {
      setLoading(false);
    }
  }, [activeTimePeriod]);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const parentParam = query.get('parent');
    if (parentParam === null) {
      setMode('parent');
    } else {
      setMode(parentParam !== 'false' ? 'parent' : 'child');
    }
  }, []);


  useEffect(() => {
    if (userId) pull(userId);
  }, [userId, pull]);


  useEffect(() => {
    const list = activeTimePeriod === 'future' ? treatmentsByPeriod.future : treatmentsByPeriod.historical;
    setSelectedTreatment(uniqueKeysFrom(list));
  }, [activeTimePeriod, treatmentsByPeriod]);


  const handleSelect = (key, autoSelectedTreatments = null) => {
    if (key === 'auto') {
      setSelectedTreatment(autoSelectedTreatments || []);
      return;
    }
    if (key === 'all') {
      const list = activeTimePeriod === 'future' ? treatmentsByPeriod.future : treatmentsByPeriod.historical;
      setSelectedTreatment(uniqueKeysFrom(list));
    } else if (key === 'none') {
      setSelectedTreatment([]);
    } else {
      setSelectedTreatment((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
    }
  };
  const handleTimePeriodSelect = (timePeriod) => {
    if (timePeriod === 'all') return;
    setActiveTimePeriod(timePeriod);
  };


  const availableTreatmentKeys = useMemo(() => {
    const list = activeTimePeriod === 'future' ? treatmentsByPeriod.future : treatmentsByPeriod.historical;
    return uniqueKeysFrom(list);
  }, [treatmentsByPeriod, activeTimePeriod]);
  return (
      <div>
  <Router>
    <div className="container">
      <BackButton />
      <Routes>
        <Route
            path="/"
            element={
              <div className="main-layout">
                <div className="main-3d" onClick={() => setShowMenu(false)} style={{ cursor: 'default' }}>
                  {loading && <p>Loading…</p>}
                  {error && <p style={{ color: '#B00020' }}>Failed: {error}</p>}
                  {!loading && !error && userId && (
                      mode === 'child' ? (
                          <WholeMouthKid selectedTreatment={selectedTreatment} />
                      ) : (
                          <WholeMouth
                              selectedTreatment={selectedTreatment}
                              setSelectedTreatment={setSelectedTreatment}
                              activeTimePeriod={activeTimePeriod}
                              treatmentsByPeriod={treatmentsByPeriod}
                              eruptionLevels={eruptionLevels}
                          />
                      )
                  )}
                  {!userId && !loading && <p>No user set. Use /u/:userId or ?userId=, or RN WebView postMessage.</p>}
                </div>
                <div className={`filter-menu-container ${showMenu ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
                  <FilterMenu
                      selected={selectedTreatment}
                      onSelect={handleSelect}
                      isOpen={showMenu}
                      activeTimePeriod={activeTimePeriod}
                      onTimePeriodSelect={handleTimePeriodSelect}
                      treatmentsByPeriod={treatmentsByPeriod}
                      availableTreatmentKeys={availableTreatmentKeys}
                  />
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
);
}