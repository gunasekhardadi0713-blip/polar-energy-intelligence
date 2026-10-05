\# Polar Energy Intelligence



\## AI-Driven Smart Energy Management for Antarctic Research Stations



\*\*SIH 2026 — Problem Statement 26061\*\*



Polar Energy Intelligence is an AI-driven energy management prototype designed to reduce diesel dependence and improve energy utilization at Antarctic and polar research stations.



The system combines electricity demand forecasting, renewable energy prediction, battery management, energy dispatch optimization, a FastAPI backend, and an interactive React dashboard.



\---



\## Problem Statement



Antarctic research stations require reliable electricity in harsh and remote environments. Diesel generation is important for reliability but involves significant fuel consumption and difficult logistics.



At the same time, renewable energy availability is variable and station electricity demand changes over time.



Our solution uses forecasting and optimization to intelligently manage renewable energy, battery storage, and diesel backup.



\---



\## How Our System Works



```text

Historical Antarctic Station Data

&#x20;             ↓

&#x20;     Data Preparation

&#x20;             ↓

&#x20;     Feature Engineering

&#x20;             ↓

&#x20;    ┌────────┴────────┐

&#x20;    ↓                 ↓

Load Forecasting   Renewable Forecasting

&#x20;  XGBoost              XGBoost

&#x20;    └────────┬────────┘

&#x20;             ↓

&#x20;    Energy Dispatch Optimization

&#x20;             ↓

&#x20;    Renewable → Battery → Diesel

&#x20;             ↓

&#x20;      FastAPI Backend

&#x20;             ↓

&#x20;      React Dashboard







Core Features

1\. AI-Based Load Forecasting

An XGBoost regression model predicts future electricity demand using historical load patterns, time-based features, weather conditions, lag features, and rolling load statistics.

2\. Renewable Energy Prediction

A second XGBoost model predicts available renewable energy using weather and temporal features such as wind speed, solar irradiance, temperature, hour, and month.

3\. Intelligent Energy Dispatch

The optimization engine determines how the station should meet its electricity demand.

The dispatch priority is:

Renewable Energy

&#x20;      ↓

Battery Storage

&#x20;      ↓

Diesel Backup



Renewable energy is prioritized first. Excess renewable energy can charge the battery, while the battery can discharge when renewable energy is insufficient.

Diesel is used as backup when renewable energy and available battery power cannot meet the demand.

4\. Battery Energy Management

The prototype manages battery state of charge within defined physical constraints.

\- Battery capacity: 1500 kWh

\- Minimum SOC: 150 kWh

\- Maximum charging power: 300 kW

\- Maximum discharging power: 300 kW

5\. Diesel Fuel Optimization

The system compares the optimized dispatch strategy with an all-diesel baseline and calculates:

\- Baseline diesel consumption

\- Optimized diesel consumption

\- Fuel saved

\- Fuel-saving percentage

\- Renewable utilization

6\. Multi-Station Support

The prototype supports four Antarctic stations:

\- Casey

\- Davis

\- Mawson

\- Macquarie Island

7\. Interactive Dashboard

The React dashboard provides:

\- Station selection

\- Diesel fuel KPIs

\- Fuel savings

\- Renewable utilization

\- Load forecast

\- Renewable forecast

\- Energy dispatch

\- Battery state of charge

\- AI-driven dispatch recommendation

Prototype Results

Across the evaluated test horizon, the prototype achieved:

Metric	Result

Baseline diesel fuel	281,981.37 L

Optimized diesel fuel	169,404.62 L

Fuel saved	112,576.74 L

Overall fuel saving	39.92%

Renewable utilization	67.19%





Casey Station Example

\- Baseline diesel: 98,406.19 L

\- Optimized diesel: 81,121.32 L

\- Fuel saved: 17,284.87 L

\- Fuel saving: 17.56%

Technology Stack

Machine Learning

\- Python

\- Pandas

\- NumPy

\- Scikit-learn

\- XGBoost

Backend

\- FastAPI

\- Uvicorn

\- Python

Frontend

\- React

\- Vite

\- Recharts

\- CSS

Data

The prototype uses historical Antarctic station data as its source basis, covering Casey, Davis, Mawson, and Macquarie Island.

Supporting weather and renewable-related information is also used for the prototype environment.

Publicly available station energy records used for the prototype are primarily monthly. Because energy dispatch requires finer temporal resolution, we constructed an hourly simulation environment for the prototype.

Therefore:

\- The hourly energy environment is prototype-simulated.

\- Renewable generation values are prototype-derived/simulated rather than live turbine telemetry.

\- The system is not connected to live Antarctic station control systems.

The purpose of the prototype is to demonstrate the complete forecasting, optimization, and energy-management pipeline.

Project Architecture

The system consists of four major layers:

Data Layer

Historical station and supporting environmental data are prepared and transformed into a model-ready dataset.

AI Layer

Two XGBoost models are used:

1\. Load forecasting

2\. Renewable energy forecasting

Optimization Layer

Forecast outputs are passed to a constrained dispatch engine that manages:

\- Renewable energy

\- Battery charging

\- Battery discharging

\- Diesel backup

\- Renewable curtailment

\- Battery state of charge

Application Layer

FastAPI exposes the forecasting and optimization results to the React dashboard.







Hackathon/

│

├── backend/

│   ├── \_\_init\_\_.py

│   ├── main.py

│   ├── schemas.py

│   ├── api\_validation.txt

│   └── services/

│       ├── data\_service.py

│       ├── forecasting\_service.py

│       └── optimization\_service.py

│

├── data/

│   ├── final/

│   │   ├── ps26061\_monthly\_reference\_prototype.csv

│   │   └── ps26061\_prototype\_hourly\_2010.csv

│   │

│   └── processed/

│       ├── ps26061\_ml\_dataset.csv

│       ├── ps26061\_features.csv

│       ├── load\_forecasting\_results.csv

│       ├── renewable\_forecasting\_results.csv

│       ├── energy\_optimization\_results.csv

│       └── validation and audit files

│

├── docs/

│   ├── dataset\_dictionary.md

│   ├── sources\_and\_provenance.md

│   ├── REPRODUCIBILITY\_NOTE.txt

│   └── validation\_summary.csv

│

├── frontend/

│   ├── src/

│   │   ├── App.jsx

│   │   ├── api.js

│   │   ├── main.jsx

│   │   └── styles.css

│   ├── index.html

│   ├── package.json

│   ├── package-lock.json

│   └── vite.config.js

│

├── models/

│   ├── ps26061\_load\_forecaster.pkl

│   └── ps26061\_renewable\_forecaster.pkl

│

├── .gitignore

└── README.md









Running the Prototype

Backend

From the project root:

python -m uvicorn backend.main:app --reload --port 8001



The backend runs at:

http://127.0.0.1:8001



Frontend

Open another terminal:

cd frontend

npm install

npm.cmd run dev



The dashboard runs at:

http://localhost:3000



API

The FastAPI backend provides endpoints for:

\- Backend health

\- Available stations

\- Station summaries

\- Load forecasts

\- Renewable forecasts

\- Energy optimization results

The API acts as the bridge between the machine-learning models, optimization engine, and React dashboard.

Validation

The prototype includes validation and audit artifacts covering:

\- Dataset integrity

\- Feature engineering

\- Forecasting performance

\- Optimization results

\- Battery SOC constraints

\- Energy balance

\- Renewable accounting

\- Station isolation

\- Chronological execution

\- No future lookahead

Future Scope

The prototype can be extended with:

\- Real-time Antarctic station telemetry

\- Live weather data

\- Actual renewable generation telemetry

\- Real-time optimization

\- Physical battery/controller integration

\- Improved forecasting models using larger real-world datasets

\- Multi-station energy coordination

