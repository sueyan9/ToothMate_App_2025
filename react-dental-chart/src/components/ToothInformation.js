import { useEffect, useState } from "react";

export default function ToothInformation({ toothNumber }) {
  const [isOpen, setIsOpen] = useState(true);
  const [toothInfo, setToothInfo] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userNhi, setUserNhi] = useState(null);

  const latestTreatmentType = (arr = []) => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    if (typeof arr[0] === 'string') return arr[0];
    return [...arr].sort((a, b) => new Date(b?.date || 0) - new Date(a?.date || 0))[0]?.type ?? null;
  };
  const onToggle = () => setIsOpen(!isOpen);

  // ① Web: URL 传参
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const uid = sp.get('userId');
      const nhi = sp.get('userNhi');
      if (uid) setUserId(uid);
      if (nhi) setUserNhi(nhi);
    } catch {}
  }, []);

  // ② RN: WebView bridge 注入
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

  // ③ 仅调用后端；没有 userId/userNhi 就不渲染
  useEffect(() => {
    let cancelled = false;
    if (!toothNumber) return;

    const mapTreatment = (t) => ({
      date: t.treatmentDate || t.plannedFor || t.date || '',
      type: t.treatmentType || t.type || '',
      notes: t.treatmentDetails || t.notes || '',
    });

    const load = async () => {
      try {
        // 优先 userId 接口；否则用 userNhi（兼容旧后端）
        let url = null;
        if (userId) {
          url = `/treatment/getTreatmentsByToothNumber/${encodeURIComponent(userId)}/${encodeURIComponent(toothNumber)}`;
        } else if (userNhi) {
          url = `/treatment/getTreatmentsByToothNumberNhi/${encodeURIComponent(userNhi)}/${encodeURIComponent(toothNumber)}`;
        } else {
          return;
        }

        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const arr = await resp.json(); // 期望为数组

        const completed = (arr || [])
            .filter(x => (x.status || '').toLowerCase() === 'completed')
            .map(mapTreatment);
        const planned = (arr || [])
            .filter(x => (x.status || '').toLowerCase() !== 'completed')
            .map(mapTreatment);

        if (!cancelled) {
          setToothInfo({
            name: `Tooth ${toothNumber}`,
            treatments: completed,
            futuretreatments: planned,
          });
        }
      } catch (e) {
        console.error('Failed to load tooth treatments:', e);
        if (!cancelled) {
          // 后端失败时也不要用 mock，给出空态
          setToothInfo({
            name: `Tooth ${toothNumber}`,
            treatments: [],
            futuretreatments: [],
          });
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [toothNumber, userId, userNhi]);

  // 打开单牙面板时通知 RN（保留）
  useEffect(() => {
    if (!isOpen || !toothInfo || !window.ReactNativeWebView) return;
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'TOOTH_SELECTED',
      payload: {
        toothNumber,
        toothName: toothInfo.name,
        treatments: toothInfo.treatments ?? [],
        treatment: latestTreatmentType(toothInfo.treatments),
      }
    }));
  }, [isOpen, toothInfo, toothNumber]);

  useEffect(() => {
    const handleClickOutside = () => { if (isOpen) setIsOpen(false); };
    document.addEventListener('click', handleClickOutside);
    return () => { document.removeEventListener('click', handleClickOutside); };
  }, [isOpen]);

  const handlePanelClick = (e) => { e.stopPropagation(); };

  const handleViewEducation = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'VIEW_EDUCATION',
        toothName: toothInfo?.name,
        treatments: toothInfo?.treatments ?? []
      }));
    }
  };

  const handleViewAppointments = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'VIEW_APPOINTMENTS',
        toothName: toothInfo?.name,
        treatments: toothInfo?.treatments ?? []
      }));
    }
  };

  // 没有 userId/userNhi 前或还未取回数据时不渲染内容
  if (!userId && !userNhi) return null;
  if (!toothInfo) return null;

  return (
      <div className={`tooth-info ${isOpen ? 'active' : ''}`} onClick={onToggle}>
        <div
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            className="tooth-info-header"
        >
          {isOpen ? `↓ ${toothInfo.name} (#${toothNumber})` : `↑ ${toothInfo.name}`}
        </div>

        {isOpen && (
            <div onClick={handlePanelClick}>
              <div className="tooth-info-content">
                <div>
                  <strong>Previous Work Done</strong>
                  {toothInfo.treatments.length > 0 ? (
                      <>
                        <ul className="treatment-list">
                          {toothInfo.treatments.map((treatment, index) => (
                              <li key={index} className="treatment-item">
                                <div>{treatment.date}</div>
                                <div>{treatment.type}</div>
                                <div>{treatment.notes}</div>
                              </li>
                          ))}
                        </ul>
                        <button
                            style={{ padding: '10px 20px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
                            onClick={handleViewEducation}
                        >
                          Learn More
                        </button>
                        <button
                            style={{ padding: '10px 20px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', marginLeft: '10px' }}
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
                  {toothInfo.futuretreatments.length > 0 ? (
                      <ul className="treatment-list">
                        {toothInfo.futuretreatments.map((treatment, index) => (
                            <li key={index} className="treatment-item">
                              <div>{treatment.date}</div>
                              <div>{treatment.type}</div>
                              <div>{treatment.notes}</div>
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
