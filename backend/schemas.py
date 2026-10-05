from typing import List, Dict, Any
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str


class StationListResponse(BaseModel):
    stations: List[str]


class SummaryResponse(BaseModel):
    baseline_fuel_liters: float
    optimized_fuel_liters: float
    fuel_saved_liters: float
    fuel_saving_percent: float
    renewable_utilization_percent: float


class ForecastResponse(BaseModel):
    station: str
    forecast: List[Dict[str, Any]]


class OptimizationResponse(BaseModel):
    station: str
    optimization: List[Dict[str, Any]]