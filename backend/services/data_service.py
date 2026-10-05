import csv
from pathlib import Path
from typing import Set

# Path to the processed data directory (relative to project root)
BASE_DIR = Path(__file__).resolve().parents[2] / "data" / "processed"

_LOAD_RESULTS = BASE_DIR / "load_forecasting_results.csv"
_RENEWABLE_RESULTS = BASE_DIR / "renewable_forecasting_results.csv"
_OPTIMIZATION_RESULTS = BASE_DIR / "energy_optimization_results.csv"

def _read_unique_stations(csv_path: Path) -> Set[str]:
    stations = set()
    with csv_path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            stations.add(row["station"])
    return stations

# Cache the stations set on first import for fast look‑ups
_STATIONS: Set[str] = set()
for p in [_LOAD_RESULTS, _RENEWABLE_RESULTS, _OPTIMIZATION_RESULTS]:
    if p.exists():
        _STATIONS.update(_read_unique_stations(p))

def get_stations_set() -> Set[str]:
    """Return the set of all station identifiers present in the result files."""
    return _STATIONS
