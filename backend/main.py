import os
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from .schemas import HealthResponse, StationListResponse, SummaryResponse, ForecastResponse, OptimizationResponse
from .services.data_service import get_stations_set
from .services.forecasting_service import get_load_forecast, get_renewable_forecast
from .services.optimization_service import get_optimization_data, get_summary_overview, get_station_summary

app = FastAPI(title="SIH 2026 PS 26061 Energy API", version="1.0.0")

# CORS – allow local React dev (http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
def health_check():
    return {"status": "ok"}

@app.get("/stations", response_model=StationListResponse)
def list_stations():
    stations = sorted(list(get_stations_set()))
    return {"stations": stations}

@app.get("/summary", response_model=SummaryResponse)
def summary_overview():
    return get_summary_overview()


@app.get("/summary/{station}", response_model=SummaryResponse)
def station_summary(station: str):
    if station not in get_stations_set():
        raise HTTPException(status_code=404,detail="Station not found")

    return get_station_summary(station) 

@app.get("/forecast/load/{station}", response_model=ForecastResponse)
def load_forecast(
    station: str,
    limit: int = Query(100, ge=1, le=2000),
):
    if station not in get_stations_set():
        raise HTTPException(status_code=404, detail="Station not found")
    data = get_load_forecast(station, limit)
    return {"station": station, "forecast": data}

@app.get("/forecast/renewable/{station}", response_model=ForecastResponse)
def renewable_forecast(
    station: str,
    limit: int = Query(100, ge=1, le=2000),
):
    if station not in get_stations_set():
        raise HTTPException(status_code=404, detail="Station not found")
    data = get_renewable_forecast(station, limit)
    return {"station": station, "forecast": data}

@app.get("/optimization/{station}", response_model=OptimizationResponse)
def optimization_endpoint(
    station: str,
    limit: int = Query(100, ge=1, le=2000),
):
    if station not in get_stations_set():
        raise HTTPException(status_code=404, detail="Station not found")
    data = get_optimization_data(station, limit)
    return {"station": station, "optimization": data}
