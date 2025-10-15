import { useEffect, useState } from "react";

export default function ToothInformation({ toothInfo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [futureTreatments, setFutureTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userNhi, setUserNhi] = useState(null);

  const latestTreatmentType = (arr = []) => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    if (typeof arr[0] === 'string') return arr[0];
    return [...arr]
        .sort((a, b) => new Date(b?.date || 0) - new Date(a?.date || 0))[0]?.type ?? null;
  };

  const onToggle = () => setIsOpen(!isOpen);

  // ① Web: URL parameters
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const uid = sp.get('userId');
      const nhi = sp.get('userNhi');
      if (uid) setUserId(uid);
      if (nhi) setUserNhi(nhi);
    } catch {}
  }, []);

  // ② RN: WebView bridge injection
  useEffect(() => {
    const handler = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg?.type === 'auth') {
          if (msg.userId) setUserId(msg.userId);
          if (msg.userNhi) setUserNhi(msg.userNhi);
        }
      } catch {}
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // ③ Call backend API to get treatment records
  useEffect(() => {
    let cancelled = false;
    if (!toothInfo?.toothNumber) return;

    const loadTreatments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Loading treatments for tooth:', toothInfo.toothNumber);
        console.log('UserId:', userId);
        console.log('UserNhi:', userNhi);

        // If no user info, don't show treatment records
        if (!userId && !userNhi) {
          if (!cancelled) {
            setTreatments([]);
            setFutureTreatments([]);
            setIsLoading(false);
          }
          return;
        }
        const getApiBaseUrl = () => {
          // 1. 优先从环境变量读取
          if (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE_URL) {
            console.log('Using environment REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
            return process.env.REACT_APP_API_BASE_URL;
          }
          if (typeof process !== 'undefined' && process.env?.API_BASE_URL) {
            console.log('Using environment API_BASE_URL:', process.env.API_BASE_URL);
            return process.env.API_BASE_URL;
          }

          // 2. 从 window 对象读取
          if (typeof window !== 'undefined' && window.API_BASE_URL) {
            console.log('Using window API_BASE_URL:', window.API_BASE_URL);
            return window.API_BASE_URL;
          }

          // 3. 动态环境检测（作为后备方案）
          const { protocol, hostname } = window.location;

          // 检查是否为 Vercel 环境
          if (hostname.includes('vercel.app')) {
            console.log('Detected Vercel environment, using Render backend');
            return 'https://toothmate-app-2025.onrender.com';
          }

          // 检查是否为 Render 环境
          if (hostname.includes('render.com') || hostname.includes('onrender.com')) {
            console.log('Detected cloud environment, using same hostname');
            return `${protocol}//${hostname}`;
          }

          // 本地开发环境
          if (hostname === 'localhost' || hostname === '127.0.0.1') {
            console.log('Detected local environment, using port 3000');
            return `${protocol}//${hostname}:3000`;
          }

          console.log('Using default Render backend');
          return 'https://toothmate-app-2025.onrender.com';
        };

        const API_BASE_URL = getApiBaseUrl();
        console.log('Final API_BASE_URL:', API_BASE_URL);

          // Call backend API to get treatment records
        let url = null;
        if (userId) {
          url = `${API_BASE_URL}/getTreatmentsByToothNumber/${encodeURIComponent(userId)}/${encodeURIComponent(toothInfo.toothNumber)}`;
        } else if (userNhi) {
          url = `${API_BASE_URL}/getTreatmentsByToothNumberNhi/${encodeURIComponent(userNhi)}/${encodeURIComponent(toothInfo.toothNumber)}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Map treatment record format
        const mapTreatment = (t) => ({
          date: t.date || '',
          type: t.treatmentType || '',
          notes: t.notes || '',
          completed: t.completed || false
        });

        // Process API returned data { historical: [], future: [] }
        const treatmentsData = (data.historical || []).map(mapTreatment);
        const futureTreatmentsData = (data.future || []).map(mapTreatment);


        if (!cancelled) {
          setTreatments(treatmentsData);
          setFutureTreatments(futureTreatmentsData);
          setIsLoading(false);
        }

      } catch (error) {

        if (!cancelled) {
          setError(`Failed to load treatments: ${error.message}`);
          setTreatments([]);
          setFutureTreatments([]);
          setIsLoading(false);
        }
      }
    };

    loadTreatments();
    return () => { cancelled = true; };
  }, [toothInfo?.toothNumber, userId, userNhi]);

  //  When the individual tooth panel opens, notify React Native
  useEffect(() => {
    if (!isOpen || !toothInfo || !window.ReactNativeWebView) return;
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'TOOTH_SELECTED',
      payload: {
        toothNumber: toothInfo.toothNumber,
        toothName: toothInfo.name,
        treatments: treatments,
        treatment: latestTreatmentType(treatments),
      }
    }));
  }, [isOpen, toothInfo, treatments]);

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
        treatments: treatments
      }));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US');
    } catch {
      return dateString;
    }
  };

  function normalizeTreatmentType(treatmentType) {
    const typeMap = {
  
      'Crown Placement': 'Crown',
      'Filling': 'Filling',
      'Extraction': 'Extraction',
      'Bridge': 'Bridge',
      'Implant': 'Implant',
      'Veneer': 'Veneer',
      'Sealant': 'Sealant',
      'root_canal': 'Root Canal',
      'crown': 'Crown',
      'filling': 'Filling',
      'extraction': 'Extraction',
      'bridge': 'Bridge',
      'implant': 'Implant',
      'veneer': 'Veneer',
      'sealant': 'Sealant',
      'Cleaning': null,
      'Checkup': null
    };
    return typeMap[treatmentType] || treatmentType?.toLowerCase();
  }

  const getAllTreatmentsDone = () => {
    if (treatments.length === 0) return '';
  
    const uniqueTypes = [...new Set(treatments.map(treatment => normalizeTreatmentType(treatment.type)))];
    return uniqueTypes.join(', ');
  }

  // Loading state
  if (isLoading) {
    return (
        <div className="tooth-info">
          <div className="tooth-info-header">
            Loading treatments...
          </div>
        </div>
    );
  }

  // Error state
  if (error) {
    return (
        <div className="tooth-info">
          <div className="tooth-info-header">
            Error loading treatments
          </div>
          <div className="tooth-info-content" style={{ color: 'red' }}>
            {error}
          </div>
        </div>
    );
  }
  if (!toothInfo) return null;

  return (
    <div style={{position: 'relative'}}>
        <button
          style={{
            position: 'fixed',
            right: '24px',
            bottom: isOpen ? 'calc(100% - 310px)' : '175px',
            padding: '8px',
            height: '82px',
            width: '82px',
            background: '#516287',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '60px',
            border: 'none',
            cursor: 'pointer',
            transition: 'bottom 0.3s ease-in-out',
            zIndex: 1001,
          }}
          onClick={handleViewEducation}
      >
        Learn {<br></br>} More
      </button>

      <div className={`tooth-info ${isOpen ? 'active' : ''}`} onClick={onToggle}>
        <div onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}>
          {!isOpen && (<div style={{color: '#666', marginBottom: '8px'}}>Work done on this tooth: {getAllTreatmentsDone() || 'None'}</div>)}
          <div className="tooth-info-header">{isOpen ? `↓ ${toothInfo.name} (#${toothInfo.toothNumber})` : `↑ ${toothInfo.name}`}</div>
        </div>
            <div onClick={handlePanelClick}>
              <div className="tooth-info-content">
              <div>
                  <strong>Previous Work Done</strong>
                  {treatments.length > 0 ? (
                      <>
                        <ul className="treatment-list">
                          {treatments.map((treatment, index) => (
                              <li key={index} className="treatment-item">
                                <div><strong>Date:</strong> {formatDate(treatment.date)}</div>
                                <div><strong>Treatment Type:</strong> {normalizeTreatmentType(treatment.type)}</div>
                                {treatment.notes && <div><strong>Notes:</strong> {treatment.notes}</div>}
                              </li>
                          ))}
                        </ul>
                      </>
                  ) : (
                      <p>No previous treatments recorded for this tooth.</p>
                  )}
                </div>

                <br />

                <div>
                  <strong>Planned Work To Do</strong>
                  {futureTreatments.length > 0 ? (
                      <ul className="treatment-list">
                        {futureTreatments.map((treatment, index) => (
                            <li key={index} className="treatment-item">
                              <div><strong>Date:</strong> {formatDate(treatment.date)}</div>
                              <div><strong>Treatment Type:</strong> {treatment.type}</div>
                              {treatment.notes && <div><strong>Notes:</strong> {treatment.notes}</div>}
                            </li>
                        ))}
                      </ul>
                  ) : (
                      <p>No planned treatments recorded for this tooth.</p>
                  )}
                </div>

              </div>
            </div>
      </div>
      </div>
  );
}