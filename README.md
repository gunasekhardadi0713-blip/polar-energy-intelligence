POLAR ENERGY INTELLIGENCE

AI-DRIVEN SMART ENERGY MANAGEMENT FOR ANTARCTIC RESEARCH STATIONS

SIH 2026 - PROBLEM STATEMENT 26061


PROJECT OVERVIEW

Polar Energy Intelligence is an AI-driven energy management prototype designed to reduce diesel dependence and improve energy utilization at Antarctic and polar research stations.

The system combines electricity demand forecasting, renewable energy prediction, battery management, energy dispatch optimization, a FastAPI backend, and an interactive React dashboard.


PROBLEM STATEMENT

Antarctic research stations require reliable electricity in harsh and remote environments. Diesel generation is important for reliability but involves significant fuel consumption and difficult logistics.

At the same time, renewable energy availability is variable and station electricity demand changes over time.

Our solution uses forecasting and optimization to intelligently manage renewable energy, battery storage, and diesel backup.


HOW OUR SYSTEM WORKS

The complete pipeline is:

Historical Antarctic Station Data
        |
        v
Data Preparation
        |
        v
Feature Engineering
        |
        +-----------------------+
        |                       |
        v                       v
Load Forecasting       Renewable Forecasting
XGBoost                 XGBoost
        |                       |
        +-----------+-----------+
                    |
                    v
        Energy Dispatch Optimization
                    |
                    v
        Renewable -> Battery -> Diesel
                    |
                    v
             FastAPI Backend
                    |
                    v
             React Dashboard


CORE FEATURES

1. AI-BASED LOAD FORECASTING

An XGBoost regression model predicts future electricity demand using historical load patterns, time-based features, weather conditions, lag features, and rolling load statistics.


2. RENEWABLE ENERGY PREDICTION

A second XGBoost model predicts available renewable energy using weather and temporal features such as wind speed, solar irradiance, temperature, hour, and month.


3. INTELLIGENT ENERGY DISPATCH

The optimization engine determines how the station should meet its electricity demand.

The dispatch priority is:

Renewable Energy
        |
        v
Battery Storage
        |
        v
Diesel Backup

Renewable energy is prioritized first. Excess renewable energy can charge the battery, while the battery can discharge when renewable energy is insufficient.

Diesel is used as backup when renewable energy and available battery power cannot meet the demand.


4. BATTERY ENERGY MANAGEMENT

The prototype manages battery state of charge within defined physical constraints.

Battery capacity: 1500 kWh
Minimum SOC: 150 kWh
Maximum charging power: 300 kW
Maximum discharging power: 300 kW


5. DIESEL FUEL OPTIMIZATION

The system compares the optimized dispatch strategy with an all-diesel baseline and calculates:

Baseline diesel consumption
Optimized diesel consumption
Fuel saved
Fuel-saving percentage
Renewable utilization


6. MULTI-STATION SUPPORT

The prototype supports four Antarctic stations:

Casey
Davis
Mawson
Macquarie Island


7. INTERACTIVE DASHBOARD

The React dashboard provides:

Station selection
Diesel fuel KPIs
Fuel savings
Renewable utilization
Load forecast
Renewable forecast
Energy dispatch
Battery state of charge
AI-driven dispatch recommendation


PROTOTYPE RESULTS

Across the evaluated test horizon, the prototype achieved:

Baseline diesel fuel: 281,981.37 L
Optimized diesel fuel: 169,404.62 L
Fuel saved: 112,576.74 L
Overall fuel saving: 39.92%
Renewable utilization: 67.19%


CASEY STATION EXAMPLE

Baseline diesel: 98,406.19 L
Optimized diesel: 81,121.32 L
Fuel saved: 17,284.87 L
Fuel saving: 17.56%


TECHNOLOGY STACK

MACHINE LEARNING

Python
Pandas
NumPy
Scikit-learn
XGBoost


BACKEND

FastAPI
Uvicorn
Python


FRONTEND

React
Vite
Recharts
CSS


DATA

The prototype uses historical Antarctic station data as its source basis, covering Casey, Davis, Mawson, and Macquarie Island.

Supporting weather and renewable-related information is also used for the prototype environment.

Publicly available station energy records used for the prototype are primarily monthly. Because energy dispatch requires finer temporal resolution, we constructed an hourly simulation environment for the prototype.

Therefore:

The hourly energy environment is prototype-simulated.

Renewable generation values are prototype-derived or simulated rather than live turbine telemetry.

The system is not connected to live Antarctic station control systems.

The purpose of the prototype is to demonstrate the complete forecasting, optimization, and energy-management pipeline.


PROJECT ARCHITECTURE

The system consists of four major layers.


DATA LAYER

Historical station and supporting environmental data are prepared and transformed into a model-ready dataset.


AI LAYER

Two XGBoost models are used:

1. Load forecasting
2. Renewable energy forecasting


OPTIMIZATION LAYER

Forecast outputs are passed to a constrained dispatch engine that manages:

Renewable energy
Battery charging
Battery discharging
Diesel backup
Renewable curtailment
Battery state of charge


APPLICATION LAYER

FastAPI exposes the forecasting and optimization results to the React dashboard.


PROJECT STRUCTURE

Hackathon

    backend
        __init__.py
        main.py
        schemas.py
        api_validation.txt

        services
            data_service.py
            forecasting_service.py
            optimization_service.py

    data

        final
            ps26061_monthly_reference_prototype.csv
            ps26061_prototype_hourly_2010.csv

        processed
            ps26061_ml_dataset.csv
            ps26061_features.csv
            load_forecasting_results.csv
            renewable_forecasting_results.csv
            energy_optimization_results.csv
            validation and audit files

    docs
        dataset_dictionary.md
        sources_and_provenance.md
        REPRODUCIBILITY_NOTE.txt
        validation_summary.csv

    frontend

        src
            App.jsx
            api.js
            main.jsx
            styles.css

        index.html
        package.json
        package-lock.json
        vite.config.js

    models
        ps26061_load_forecaster.pkl
        ps26061_renewable_forecaster.pkl

    .gitignore
    README.md


RUNNING THE PROTOTYPE

BACKEND

From the project root, run:

python -m uvicorn backend.main:app --reload --port 8001

The backend runs at:

http://127.0.0.1:8001


FRONTEND

Open another terminal and run:

cd frontend

npm install

npm.cmd run dev

The dashboard runs at:

http://localhost:3000


API

The FastAPI backend provides endpoints for:

Backend health
Available stations
Station summaries
Load forecasts
Renewable forecasts
Energy optimization results

The API acts as the bridge between the machine-learning models, optimization engine, and React dashboard.


VALIDATION

The prototype includes validation and audit artifacts covering:

Dataset integrity
Feature engineering
Forecasting performance
Optimization results
Battery SOC constraints
Energy balance
Renewable accounting
Station isolation
Chronological execution
No future lookahead


FUTURE SCOPE

The prototype can be extended with:

Real-time Antarctic station telemetry
Live weather data
Actual renewable generation telemetry
Real-time optimization
Physical battery/controller integration
Improved forecasting models using larger real-world datasets
Multi-station energy coordination


IMPORTANT PROTOTYPE DISCLAIMER

This project is a prototype implementation for SIH 2026 Problem Statement 26061.

The reported fuel savings represent results from the prototype's simulated test environment and should not be interpreted as measured savings from an operational Antarctic research station.

The system demonstrates how forecasting, optimization, and intelligent energy management can be combined to reduce diesel dependence while maintaining reliable energy supply.