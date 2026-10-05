const BASE_URL = 'http://127.0.0.1:8001'

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json()
}

export function getHealth() {
  return apiFetch('/health')
}

export function getStations() {
  return apiFetch('/stations')
}

export function getSummary(station) {
  return apiFetch(`/summary/${encodeURIComponent(station)}`)
}

export function getLoadForecast(station) {
  return apiFetch(`/forecast/load/${encodeURIComponent(station)}?limit=100`)
}

export function getRenewableForecast(station) {
  return apiFetch(`/forecast/renewable/${encodeURIComponent(station)}?limit=100`)
}

export function getOptimization(station) {
  return apiFetch(`/optimization/${encodeURIComponent(station)}?limit=100`)
}
