# PS26061 Dataset Dictionary

## Core file
`ps26061_prototype_hourly_2010.csv`

Granularity: 1 row per station-hour for 2010 (35,040 rows; 4 stations x 8,760 hours).

### Fields
- timestamp_utc: hourly timestamp in UTC.
- station: Casey, Davis, Mawson, or Macquarie Island.
- latitude, longitude: station coordinates from AADC metadata.
- temperature_c_derived: hourly temperature proxy derived from a monthly seasonal value + diurnal/noise profile.
- wind_speed_ms_derived: hourly wind-speed proxy derived from a monthly station profile + diurnal/noise profile.
- solar_irradiance_wm2_derived: hourly solar proxy for demonstration.
- electricity_load_kwh_derived: hourly electrical load after disaggregating the monthly prototype total.
- wind_generation_kwh_derived: simulated wind generation from an assumed turbine capacity and hourly wind proxy.
- solar_generation_kwh_derived: simulated solar generation from an assumed PV capacity and hourly irradiance proxy.
- renewable_available_kwh_derived: wind + solar.
- battery_soc_kwh_derived: simulated battery state of charge.
- battery_charge_kwh_derived: simulated charging.
- battery_discharge_kwh_derived: simulated discharging.
- diesel_generation_kwh_derived: remaining deficit supplied by diesel.
- diesel_fuel_litres_derived: diesel generation x 0.28 L/kWh prototype assumption.
- data_status: always `prototype_derived` in this file.
- historical_source_period_basis: provenance note.
- weather_source_basis: provenance note.
- optimization_note: explains that dispatch fields are simulation outputs.

## Why hourly values are derived
AADC's electricity and generator/boiler fuel indicators are monthly. Monthly energy cannot be truthfully converted to actual historical hourly telemetry without an hourly measurement series.

For the prototype, the monthly load is converted to hourly load using a profile-weighting method:
1. Create an hourly base/activity profile.
2. Add small stochastic variation.
3. Normalize all hourly weights within each calendar month.
4. Multiply normalized weights by the month-level energy total.

This guarantees:
`sum(hourly_load_in_month) == monthly_load_prototype`.

The resulting hourly values are suitable for a demo/ML prototype but must not be described as raw AADC hourly measurements.
