import { useState, useEffect, useCallback } from 'react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  getHealth, getStations,
  getSummary, getLoadForecast, getRenewableForecast, getOptimization,
} from './api.js'

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtNum(n, decimals = 0) {
  if (n == null || isNaN(n)) return '—'
  return Number(n).toLocaleString('en-IN', { maximumFractionDigits: decimals })
}

function fmtTs(ts) {
  if (!ts) return ''
  // Keep only HH:MM for X-axis brevity
  const d = new Date(ts)
  if (isNaN(d)) return ts.slice(11, 16) || ts
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function genRecommendation(optData, summary) {
  if (!optData || optData.length === 0) return 'Awaiting optimization data…'
  const latest = optData[optData.length - 1]
  const soc = parseFloat(latest?.battery_soc_end_kwh ?? 0)
  const renewable = parseFloat(latest?.renewable_to_load_kwh ?? 0)
  const diesel = parseFloat(latest?.diesel_to_load_kwh ?? 0)
  const total = renewable + diesel + parseFloat(latest?.battery_discharge_kwh ?? 0)
  const renewPct = total > 0 ? renewable / total : 0
  const dieselPct = total > 0 ? diesel / total : 0

  if (renewPct > 0.5 && soc < 1350)
    return 'Prioritize renewable generation and charge the battery with available surplus.'
  if (soc < 300)
    return 'Maintain renewable priority and preserve battery reserve for upcoming demand.'
  if (dieselPct > 0.4)
    return 'Reduce diesel dependency by maximizing renewable utilization and battery discharge.'
  return 'Current dispatch is operating with strong renewable contribution.'
}

// ─── Small sub-components ───────────────────────────────────────────────────

function Loading() {
  return (
    <div className="loading-box">
      <span className="spinner" /> Loading…
    </div>
  )
}

function Err({ msg }) {
  return <div className="error-box">⚠ {msg}</div>
}

function KpiCard({ label, value, unit, colorClass }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${colorClass || 'neutral'}`}>{value}</div>
      {unit && <div className="kpi-unit">{unit}</div>}
    </div>
  )
}

function BatteryIndicator({ soc }) {
  const capacity = 1500
  const minSoc = 150
  const pct = Math.min(100, Math.max(0, (soc / capacity) * 100))
  const minPct = (minSoc / capacity) * 100
  const colorClass = pct > 60 ? 'high' : pct > 25 ? 'mid' : 'low'

  return (
    <div>
      <div className="battery-stats">
        <div>
          <div className="bstat-label">Current SOC</div>
          <div className="bstat-value">{fmtNum(soc, 1)} kWh</div>
        </div>
        <div>
          <div className="bstat-label">Capacity</div>
          <div className="bstat-value">1,500 kWh</div>
        </div>
        <div>
          <div className="bstat-label">Min SOC</div>
          <div className="bstat-value">150 kWh</div>
        </div>
        <div>
          <div className="bstat-label">Charge %</div>
          <div className="bstat-value">{pct.toFixed(1)} %</div>
        </div>
      </div>

      <div className="battery-bar-wrap">
        <div
          className={`battery-bar-fill ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
        <div
          className="battery-bar-min"
          style={{ left: `${minPct}%` }}
          title="Minimum SOC"
        />
      </div>
      <div className="battery-bar-label">
        <span>0 kWh</span>
        <span>▲ Min 150</span>
        <span>1,500 kWh</span>
      </div>
    </div>
  )
}

// ─── Main App ───────────────────────────────────────────────────────────────

const FALLBACK_STATIONS = ['Casey', 'Davis', 'Mawson', 'Macquarie Island']

export default function App() {
  const [backendStatus, setBackendStatus] = useState('checking') // 'online'|'offline'|'checking'
  const [stations, setStations] = useState(FALLBACK_STATIONS)
  const [selectedStation, setSelectedStation] = useState('Casey')

  const [summary, setSummary] = useState(null)
  const [summaryErr, setSummaryErr] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(false)

  const [loadForecast, setLoadForecast] = useState(null)
  const [loadErr, setLoadErr] = useState(null)
  const [loadLoading, setLoadLoading] = useState(false)

  const [renewForecast, setRenewForecast] = useState(null)
  const [renewErr, setRenewErr] = useState(null)
  const [renewLoading, setRenewLoading] = useState(false)

  const [optData, setOptData] = useState(null)
  const [optErr, setOptErr] = useState(null)
  const [optLoading, setOptLoading] = useState(false)

  // Health check
  useEffect(() => {
    setBackendStatus('checking')
    getHealth()
      .then(() => setBackendStatus('online'))
      .catch(() => setBackendStatus('offline'))
  }, [])

  // Fetch stations list once
  useEffect(() => {
    getStations()
      .then(d => { if (d?.stations?.length) setStations(d.stations) })
      .catch(() => { }) // silently fall back to default list
  }, [])

  // Fetch all data when station changes
  const fetchAll = useCallback((station) => {
    // Summary
    setSummaryLoading(true); setSummaryErr(null)
    getSummary(station)
      .then(d => { setSummary(d); setSummaryLoading(false) })
      .catch(e => { setSummaryErr(e.message); setSummaryLoading(false) })

    // Load forecast
    setLoadLoading(true); setLoadErr(null)
    getLoadForecast(station)
      .then(d => { setLoadForecast(d?.forecast ?? []); setLoadLoading(false) })
      .catch(e => { setLoadErr(e.message); setLoadLoading(false) })

    // Renewable forecast
    setRenewLoading(true); setRenewErr(null)
    getRenewableForecast(station)
      .then(d => { setRenewForecast(d?.forecast ?? []); setRenewLoading(false) })
      .catch(e => { setRenewErr(e.message); setRenewLoading(false) })

    // Optimization
    setOptLoading(true); setOptErr(null)
    getOptimization(station)
      .then(d => { setOptData(d?.optimization ?? []); setOptLoading(false) })
      .catch(e => { setOptErr(e.message); setOptLoading(false) })
  }, [])

  useEffect(() => { fetchAll(selectedStation) }, [selectedStation, fetchAll])

  // Prepare chart data
  const loadChartData = (loadForecast || []).map(r => ({
    ts: fmtTs(r.timestamp_utc),
    actual: parseFloat(r.actual_load_kwh),
    predicted: parseFloat(r.xgboost_prediction_kwh),
  }))

  const renewChartData = (renewForecast || []).map(r => ({
    ts: fmtTs(r.timestamp_utc),
    actual: parseFloat(r.actual_renewable_available_kwh),
    predicted: parseFloat(r.predicted_renewable_available_kwh),
  }))

  const dispatchData = (optData || []).map(r => ({
    ts: fmtTs(r.timestamp_utc),
    renewable: parseFloat(r.renewable_to_load_kwh),
    battery: parseFloat(r.battery_discharge_kwh),
    diesel: parseFloat(r.diesel_to_load_kwh),
  }))

  const latestSoc = optData && optData.length > 0
    ? parseFloat(optData[optData.length - 1]?.battery_soc_kwh ?? 0)
    : 0

  const recommendation = genRecommendation(optData, summary)

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-left">
          <h1 className="header-title">Polar Energy Intelligence</h1>
          <p className="header-subtitle">AI-Driven Energy Management — SIH 2026 PS 26061</p>
        </div>

        <div className="header-right">
          <span className={`status-pill ${backendStatus}`}>
            <span className="status-dot" />
            {backendStatus === 'online' ? 'Backend Connected'
              : backendStatus === 'offline' ? 'Backend Offline'
                : 'Checking…'}
          </span>

          <select
            id="station-selector"
            className="station-select"
            value={selectedStation}
            onChange={e => setSelectedStation(e.target.value)}
            aria-label="Select station"
          >
            {stations.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </header>

      {/* ── Backend offline banner ── */}
      {backendStatus === 'offline' && (
        <div className="offline-banner" role="alert">
          ⚡ Backend is unreachable at http://127.0.0.1:8001 — please start the FastAPI server.
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="section-title">Station Summary · {selectedStation}</div>
      {summaryLoading && <Loading />}
      {summaryErr && <Err msg={`Summary error: ${summaryErr}`} />}
      {!summaryLoading && !summaryErr && summary && (
        <div className="kpi-grid">
          <KpiCard
            label="Baseline Diesel Fuel"
            value={fmtNum(summary.baseline_fuel_liters)}
            unit="liters"
            colorClass="warn"
          />
          <KpiCard
            label="Optimized Diesel Fuel"
            value={fmtNum(summary.optimized_fuel_liters)}
            unit="liters"
            colorClass="neutral"
          />
          <KpiCard
            label="Fuel Saved"
            value={fmtNum(summary.fuel_saved_liters)}
            unit="liters"
            colorClass="good"
          />
          <KpiCard
            label="Fuel Saving"
            value={`${fmtNum(summary.fuel_saving_percent, 1)}%`}
            colorClass="good"
          />
          <KpiCard
            label="Renewable Utilization"
            value={`${fmtNum(summary.renewable_utilization_percent, 1)}%`}
            colorClass="good"
          />
        </div>
      )}

      {/* ── Forecast Charts ── */}
      <div className="charts-grid">
        {/* Load Forecast */}
        <div className="chart-card">
          <div className="chart-title">Load Forecast</div>
          {loadLoading && <Loading />}
          {loadErr && <Err msg={loadErr} />}
          {!loadLoading && !loadErr && loadChartData.length > 0 && (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={loadChartData} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ts" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10 }} unit=" kWh" width={72} />
                <Tooltip
                  contentStyle={{ background: '#1a2235', border: '1px solid #1e2d45', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="actual" name="Actual Load" stroke="#38bdf8" dot={false} strokeWidth={1.8} />
                <Line type="monotone" dataKey="predicted" name="XGBoost Forecast" stroke="#f59e0b" dot={false} strokeWidth={1.8} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          )}
          {!loadLoading && !loadErr && loadChartData.length === 0 && (
            <div className="loading-box">No data available.</div>
          )}
        </div>

        {/* Renewable Forecast */}
        <div className="chart-card">
          <div className="chart-title">Renewable Generation Forecast</div>
          {renewLoading && <Loading />}
          {renewErr && <Err msg={renewErr} />}
          {!renewLoading && !renewErr && renewChartData.length > 0 && (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={renewChartData} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ts" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10 }} unit=" kWh" width={72} />
                <Tooltip
                  contentStyle={{ background: '#1a2235', border: '1px solid #1e2d45', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="actual" name="Actual Renewable" stroke="#34d399" dot={false} strokeWidth={1.8} />
                <Line type="monotone" dataKey="predicted" name="Predicted Renewable" stroke="#a78bfa" dot={false} strokeWidth={1.8} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          )}
          {!renewLoading && !renewErr && renewChartData.length === 0 && (
            <div className="loading-box">No data available.</div>
          )}
        </div>
      </div>

      {/* ── Dispatch + Battery + Recommendation ── */}
      <div className="bottom-grid">
        {/* Energy Dispatch stacked bar */}
        <div className="chart-card">
          <div className="chart-title">Energy Dispatch</div>
          {optLoading && <Loading />}
          {optErr && <Err msg={optErr} />}
          {!optLoading && !optErr && dispatchData.length > 0 && (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dispatchData} margin={{ top: 4, right: 16, bottom: 4, left: 0 }} stackOffset="sign">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ts" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10 }} unit=" kWh" width={72} />
                <Tooltip
                  contentStyle={{ background: '#1a2235', border: '1px solid #1e2d45', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="renewable" name="Renewable to Load" stackId="a" fill="#34d399" />
                <Bar dataKey="battery" name="Battery Discharge" stackId="a" fill="#38bdf8" />
                <Bar dataKey="diesel" name="Diesel to Load" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          )}
          {!optLoading && !optErr && dispatchData.length === 0 && (
            <div className="loading-box">No data available.</div>
          )}
        </div>

        {/* Right column: Battery + Recommendation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Battery */}
          <div className="battery-card">
            <div className="chart-title">Battery Status</div>
            {optLoading && <Loading />}
            {optErr && <Err msg={optErr} />}
            {!optLoading && !optErr && <BatteryIndicator soc={latestSoc} />}
          </div>

          {/* AI Recommendation */}
          <div className="rec-card">
            <div className="rec-header">
              <span className="rec-icon">🤖</span>
              AI Dispatch Recommendation
            </div>
            <div className="rec-body">{recommendation}</div>
            <div className="rec-hint">Rule-based · derived from live API data · no external AI service</div>
          </div>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="disclaimer">
        <strong>Prototype Notice:</strong> Hourly renewable values are simulated/derived for demonstration purposes.
        Historical station data (AADC, 1993–2016) is used as the source basis for all prototyped time series.
        Battery and diesel dispatch figures are simulated outputs of the PS 26061 optimization engine.
      </div>
    </div>
  )
}
