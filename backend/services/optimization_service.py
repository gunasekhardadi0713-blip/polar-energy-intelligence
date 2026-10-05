import csv
from pathlib import Path
from typing import List, Dict, Any


BASE_DIR = Path(__file__).resolve().parents[2] / "data" / "processed"

_OPTIMIZATION_RESULTS = BASE_DIR / "energy_optimization_results.csv"
_SUMMARY_FILE = BASE_DIR / "energy_optimization_summary.txt"


def _read_csv_limit(
    path: Path,
    station: str,
    limit: int
) -> List[Dict[str, str]]:
    rows: List[Dict[str, str]] = []

    with path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            if row["station"] == station:
                rows.append(row)

                if len(rows) >= limit:
                    break

    return rows


def _read_all_rows(path: Path) -> List[Dict[str, str]]:
    with path.open("r", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def get_optimization_data(
    station: str,
    limit: int
) -> List[Dict[str, str]]:
    """Return up to limit optimization rows for a station."""
    return _read_csv_limit(
        _OPTIMIZATION_RESULTS,
        station,
        limit
    )


def _calculate_summary(
    rows: List[Dict[str, str]]
) -> Dict[str, float]:

    if not rows:
        return {
            "baseline_fuel_liters": 0.0,
            "optimized_fuel_liters": 0.0,
            "fuel_saved_liters": 0.0,
            "fuel_saving_percent": 0.0,
            "renewable_utilization_percent": 0.0,
        }

    baseline_fuel = sum(
        float(row["baseline_fuel_liters"])
        for row in rows
    )

    optimized_fuel = sum(
        float(row["optimized_fuel_liters"])
        for row in rows
    )

    fuel_saved = sum(
        float(row["fuel_saved_liters"])
        for row in rows
    )

    predicted_renewable = sum(
        float(row["predicted_renewable_available_kwh"])
        for row in rows
    )

    renewable_to_load = sum(
        float(row["renewable_to_load_kwh"])
        for row in rows
    )

    battery_charge = sum(
        float(row["battery_charge_kwh"])
        for row in rows
    )

    if baseline_fuel > 0:
        fuel_saving_percent = (
            fuel_saved / baseline_fuel
        ) * 100
    else:
        fuel_saving_percent = 0.0

    if predicted_renewable > 0:
        renewable_utilization_percent = (
            (renewable_to_load + battery_charge)
            / predicted_renewable
        ) * 100
    else:
        renewable_utilization_percent = 0.0

    return {
        "baseline_fuel_liters": round(baseline_fuel, 2),
        "optimized_fuel_liters": round(optimized_fuel, 2),
        "fuel_saved_liters": round(fuel_saved, 2),
        "fuel_saving_percent": round(fuel_saving_percent, 2),
        "renewable_utilization_percent": round(
            renewable_utilization_percent,
            2
        ),
    }


def get_summary_overview() -> Dict[str, float]:
    """Calculate overall optimization summary."""
    rows = _read_all_rows(_OPTIMIZATION_RESULTS)
    return _calculate_summary(rows)


def get_station_summary(station: str) -> Dict[str, float]:
    rows = _read_all_rows(_OPTIMIZATION_RESULTS)

    station_rows = [
        row for row in rows
        if row["station"] == station
    ]

    return _calculate_summary(station_rows)