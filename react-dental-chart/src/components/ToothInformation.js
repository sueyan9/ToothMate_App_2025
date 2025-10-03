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

        // 使用环境变量中的API地址
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

        // Call backend API to get treatment records
        let url = null;
        if (userId) {
          url = `${API_BASE_URL}/getTreatmentsByToothNumber/${encodeURIComponent(userId)}/${encodeURIComponent(toothInfo.toothNumber)}`;
        } else if (userNhi) {
          url = `${API_BASE_URL}/getTreatmentsByToothNumberNhi/${encodeURIComponent(userNhi)}/${encodeURIComponent(toothInfo.toothNumber)}`;
        }

        console.log('API Base URL:', API_BASE_URL);
        console.log('Fetching treatments from:', url);

        const response = await fetch(url);
        console.log('Response status:', response.status);

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

        console.log('Mapped treatments:', treatmentsData);
        console.log('Mapped future treatments:', futureTreatmentsData);

        if (!cancelled) {
          setTreatments(treatmentsData);
          setFutureTreatments(futureTreatmentsData);
          setIsLoading(false);
        }

      } catch (error) {
        console.error('Failed to load treatments:', error);
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

  // 👉 When the individual tooth panel opens, notify React Native
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

  const handleViewAppointments = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'VIEW_APPOINTMENTS',
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
      <div className={`tooth-info ${isOpen ? 'active' : ''}`} onClick={onToggle}>
        <div onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }} className="tooth-info-header">
          {isOpen ? `↓ ${toothInfo.name} (#${toothInfo.toothNumber})` : `↑ ${toothInfo.name}`}
        </div>

        {isOpen && (
            <div onClick={handlePanelClick}>
              <div className="tooth-info-content">
                {/* Basic Tooth Information */}
                <div className="tooth-basic-info">
                  <h4>Basic Tooth Information</h4>
                  <div className="tooth-basic-info-container">
                    <div className="tooth-info-item">
                      <strong className="tooth-info-label">Position:</strong>
                      <span className="tooth-info-value">{toothInfo.position}</span>
                    </div>
                    <div className="tooth-info-item">
                      <strong className="tooth-info-label">Type:</strong>
                      <span className="tooth-info-value">{toothInfo.type}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <strong>Previous Work Done</strong>
                  {treatments.length > 0 ? (
                      <>
                        <ul className="treatment-list">
                          {treatments.map((treatment, index) => (
                              <li key={index} className="treatment-item">
                                <div><strong>Date:</strong> {formatDate(treatment.date)}</div>
                                <div><strong>Treatment Type:</strong> {treatment.type}</div>
                                {treatment.notes && <div><strong>Notes:</strong> {treatment.notes}</div>}
                              </li>
                          ))}
                        </ul>

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
        )}
      </div>
  );
}