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

function useUserId() {
  const [userId, setUserId] = React.useState(null);

  const parseFromUrl = React.useCallback(() => {
    try {
      // 1) search: ?userId= / ?userid= / ?uid=
      console.log('[web] href=', window.location.href);
      const qs = new URLSearchParams(window.location.search || "");
      console.log('[web] search=', window.location.search, 'userId=', qs.get('userId'));
      const fromQuery =
          qs.get("userId") || qs.get("userid") || qs.get("uid");
      if (fromQuery) return String(fromQuery);

      // hash
      const hash = window.location.hash || "";
      if (hash) {
        const hashUrl = new URL(hash.replace(/^#/, ""), window.location.origin);
        const hqs = hashUrl.searchParams;
        const fromHashQuery = hqs.get("userId") || hqs.get("userid") || hqs.get("uid");
        if (fromHashQuery) return String(fromHashQuery);
        const mHash = hashUrl.pathname.match(/^\/u\/([^/]+)/);
        if (mHash && mHash[1]) return decodeURIComponent(mHash[1]);
      }

      // pathname
      const m = window.location.pathname.match(/^\/u\/([^/]+)/);
      if (m && m[1]) return decodeURIComponent(m[1]);

      return null;
    } catch {
      return null;
    }
  }, []);

  // 把 /u/:id 或 hash 形式 规范化 为 /?userId=:id，并保留现有的其它 query（如 parent）
  const normalizeUrlIfNeeded = React.useCallback((id) => {
    if (!id) return;
    const loc = window.location;
    const sp = new URLSearchParams(loc.search || "");
    const already = sp.get("userId") || sp.get("userid") || sp.get("uid");
    const isUPath = /^\/u\/[^/]+/.test(loc.pathname);
    const isHashU = /^#\/u\/[^/]+/.test(loc.hash || "");
    if (!already || isUPath || isHashU) {
      sp.set("userId", id);
      window.history.replaceState(null, "", `/?${sp.toString()}`);
    }
  }, []);

  React.useEffect(() => {
    // 初次解析
    const initial = parseFromUrl();
    if (initial) {
      normalizeUrlIfNeeded(initial);
      setUserId(String(initial));
    }

    const onUrlChange = () => {
      const id = parseFromUrl();
      if (id) normalizeUrlIfNeeded(id);
      setUserId(id ? String(id) : null);
    };
    // 代理 pushState/replaceState，捕获 SPA 内部导航（用 window.history）
       const origPush = window.history.pushState;
       const origReplace = window.history.replaceState;
       window.history.pushState = function (...args) {
         const ret = origPush.apply(window.history, args);
           window.dispatchEvent(new Event("urlchange"));
           return ret;
         };
      window.history.replaceState = function (...args) {
          const ret = origReplace.apply(window.history, args);
           window.dispatchEvent(new Event("urlchange"));
           return ret;
         };
    // RN → Web 的 message（你的 WebView onLoadEnd 注入的那条）
    const onMessage = (e) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        const incoming =
            data?.userId ??
            (data?.type === "setUserId" ? data.userId : null);
        if (incoming) {
          normalizeUrlIfNeeded(String(incoming));
          setUserId(String(incoming));
        }
      } catch {
        // 非 JSON 忽略
      }
    };

    window.addEventListener("message", onMessage);
    window.addEventListener("popstate", onUrlChange);
    window.addEventListener("hashchange", onUrlChange);
    window.addEventListener("urlchange", onUrlChange);

    return () => {
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
      window.removeEventListener("message", onMessage);
      window.removeEventListener("popstate", onUrlChange);
      window.removeEventListener("hashchange", onUrlChange);
      window.removeEventListener("urlchange", onUrlChange);
    };
  }, [parseFromUrl, normalizeUrlIfNeeded]);

  return [userId, setUserId];
}

// 兼容多种环境变量来源（CRA / Vite / 直接注入到 window）
const API_BASE_URL =
    (typeof window !== 'undefined' && window.API_BASE_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
    (typeof process !== 'undefined' && process.env && (process.env.REACT_APP_API_BASE_URL || process.env.API_BASE_URL)) ||
    '';

function normalizeTreatments(payload) {
  // 期望返回结构：
  // { historical: [], future: [], eruptionLevels: { 11: 0.8, ... } }
  if (payload?.historical || payload?.future) {
    return {
      historical: Array.isArray(payload.historical) ? payload.historical : [],
      future: Array.isArray(payload.future) ? payload.future : [],
      eruptionLevels: payload?.eruptionLevels || {},
    };
  }

  // 兼容返回 { treatments: [...] } 的情况：按时间或 period 字段切分
  const all = Array.isArray(payload?.treatments) ? payload.treatments : [];
  const now = Date.now();
  const historical = [];
  const future = [];
  for (const t of all) {
    if (t?.period === 'historical') historical.push(t);
    else if (t?.period === 'future') future.push(t);
    else if (t?.date || t?.scheduledAt) {
      const ts = new Date(t.date || t.scheduledAt).getTime();
      (isFinite(ts) && ts > now ? future : historical).push(t);
    } else {
      historical.push(t); // 默认丢到历史
    }
  }
  return { historical, future, eruptionLevels: payload?.eruptionLevels || {} };
}

// 用于 UI 上展示的键集合（你之前报错的函数也一并给出）
function uniqueKeysFrom(list) {
  const s = new Set();
  (Array.isArray(list) ? list : []).forEach((item) => {
    let k = item?.key ?? item?.code ?? item?.id ?? item?.name ?? item?.treatmentKey;
    if (!k && item?.toothNumber != null) k = `tooth_${item.toothNumber}`;
    if (!k && item?.toothId != null) k = `tooth_${item.toothId}`;
    if (!k && item?.type) k = String(item.type);
    if (k != null) s.add(String(k));
  });
  return Array.from(s).sort();
}

// 真正的获取函数：App.js 里直接调用 pull(userId) -> 这里
async function fetchTreatmentsByUser(userId) {
  // 如果没配置 API_BASE_URL，直接给出可用的本地 mock，便于先跑通 UI
  if (!API_BASE_URL) {
    // console.warn('API_BASE_URL is empty; returning mock data.');
    return {
      historical: [
        { id: 'h1', key: 'filling', toothNumber: 26, date: '2024-08-01' },
        { id: 'h2', key: 'root_canal', toothNumber: 36, date: '2024-09-12' },
      ],
      future: [
        { id: 'f1', key: 'crown', toothNumber: 16, date: '2025-12-01' },
      ],
      eruptionLevels: { 11: 0.9, 12: 0.7 },
    };
  }

  const base = API_BASE_URL.replace(/\/$/, '');
  // 你后端如果是另一种路径，自行改成 /api/treatments/by-user/:id 也可以
  const url = `${base}/treatments?userId=${encodeURIComponent(userId)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText} ${text ? `- ${text}` : ''}`);
  }

  const data = await res.json();
  return normalizeTreatments(data);
}

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