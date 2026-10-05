import csv
from pathlib import Path
from typing import List, Dict

BASE_DIR = Path(__file__).resolve().parents[2] / "data" / "processed"

_LOAD_RESULTS = BASE_DIR / "load_forecasting_results.csv"
_RENEWABLE_RESULTS = BASE_DIR / "renewable_forecasting_results.csv"

def _read_csv_limit(path: Path, station: str, limit: int) -> List[Dict[str, str]]:
    rows: List[Dict[str, str]] = []
    with path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["station"] == station:
                rows.append(row)
                if len(rows) >= limit:
                    break
    return rows

def get_load_forecast(station: str, limit: int) -> List[Dict[str, str]]:
    """Return up to *limit* rows of load forecasting results for *station* ordered by timestamp."""
    return _read_csv_limit(_LOAD_RESULTS, station, limit)

def get_renewable_forecast(station: str, limit: int) -> List[Dict[str, str]]:
    """Return up to *limit* rows of renewable forecasting results for *station* ordered by timestamp."""
    return _read_csv_limit(_RENEWABLE_RESULTS, station, limit)
