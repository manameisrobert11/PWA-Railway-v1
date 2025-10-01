import React, { useEffect, useState } from 'react';

/**
 * StartPage
 * Landing screen with two primary actions and a live welcome panel.
 * Props:
 *  - onStartScan: () => void
 *  - onExport: () => void
 *  - operator?: string  (optional, used in greeting)
 */
export default function StartPage({ onStartScan, onExport, operator = 'Operator' }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
      {/* Header band */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #e8f0ff, #ffffff)',
        padding: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <div className="brand" style={{ fontSize: 22 }}>Rail Inventory</div>
          <div className="status" style={{ marginTop: 4 }}>Welcome to your daily operations hub</div>
        </div>
        <div className="badge">Start</div>
      </div>

      {/* Main grid: actions + welcome/time */}
      <div className="grid" style={{ marginTop: 24 }}>
        {/* Actions */}
        <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ marginBottom: 8 }}>Quick Actions</h3>

          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Scan Rails / Barcodes</div>
              <div className="status">Open the camera scanner to capture serials into the staging list.</div>
            </div>
            <button className="btn" onClick={onStartScan}>Start Scanning</button>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Export Master Excel</div>
              <div className="status">Append staged scans to the macro-enabled workbook and download.</div>
            </div>
            <button className="btn" onClick={onExport}>Export Excel</button>
          </div>
        </section>

        {/* Welcome + Time */}
        <aside className="card" style={{
          display: 'flex', flexDirection: 'column', gap: 14,
          background: 'linear-gradient(135deg, rgba(37,99,235,0.08), #fff)'
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1d4ed8' }}>
            Hi {operator || 'Operator'}, welcome back 👋
          </div>
          <div className="status">You're signed in and ready to work. Choose an action on the left to get started.</div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div className="status" style={{ marginBottom: 6 }}>Current Date</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{dateStr}</div>
            <div className="status" style={{ marginTop: 16 }}>Local Time</div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 0.5 }}>{timeStr}</div>
          </div>

          <div className="status">Time auto-refreshes every second and uses your device locale/timezone.</div>
        </aside>
      </div>
    </div>
  );
}
