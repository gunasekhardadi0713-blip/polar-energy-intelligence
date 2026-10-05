# PS26061 Data Sources and Provenance

## Primary energy source
Australian Antarctic Data Centre (AADC), SOE Indicator 59 — Monthly electricity usage at Australian Antarctic Stations.
- Official source: https://data.aad.gov.au/aadc/soe/display_indicator.cfm?soe_id=59
- Metadata DOI: https://doi.org/10.26179/5d38f549336a7
- Covers Casey, Davis, Mawson and Macquarie Island.
- AADC describes the electricity measurement as monthly kWh from station plant-inspector reports.
- The public AADC page currently requires login to view/download the observation table.

## Primary fuel source
AADC, SOE Indicator 56 — Monthly fuel usage of generator sets and boilers.
- Official source: https://data.aad.gov.au/aadc/soe/display_indicator.cfm?soe_id=56
- Metadata DOI: https://doi.org/10.26179/5d2ea1b98cba3
- Monthly litres from station records.
- Fuel includes generator and boiler use; it is not a pure electricity-only fuel meter.

## Weather source basis
AADC SOE Indicator 1 — Monthly mean air temperatures at Australian Antarctic Stations.
- Official source: https://data.aad.gov.au/aadc/soe/display_indicator.cfm?soe_id=1

AADC SOE Indicator 7 — Monthly mean of three-hourly wind speeds.
- Official indicator is linked from the AADC energy indicators.

## Hourly-weather option for later
Copernicus ERA5 hourly reanalysis:
- https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels
- Provides hourly 2 m temperature, 10 m wind components, surface solar radiation and more.

## Renewable energy context
Australian Antarctic Program — Mawson wind power:
- https://www.antarctica.gov.au/antarctic-operations/stations-and-field-locations/amenities-and-operations/renewable-energy/wind-power/
- AAD states that two 300 kW turbines were installed at Mawson in 2003; one 300 kW turbine remains operational today.

## Prototype disclosure
The file delivered with this project is NOT a raw hourly AADC dataset.
The hourly electricity, weather, renewable generation, battery, and diesel fields are derived/simulated for the SIH prototype.
The dataset is calibrated to the scale/trends documented in official Australian Antarctic State of the Environment material, while keeping the derivation explicit.
