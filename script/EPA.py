#!/usr/bin/env python3


import requests
import pandas as pd
from datetime import datetime, timedelta
import os
import time

def fetch_epa_data(email, api_key, state_code, county_code, site_code, 
                   parameter_code, start_date, end_date):
    """
    Fetch historical air quality data from EPA's AQS API.
    
    Parameters:
    - email (str): Your registered email with EPA
    - api_key (str): Your EPA API key
    - state_code (str): Two-digit state code
    - county_code (str): Three-digit county code
    - site_code (str): Four-digit site code
    - parameter_code (str): Five-digit parameter code (e.g., '44201' for Ozone)
    - start_date (str): Start date in YYYYMMDD format
    - end_date (str): End date in YYYYMMDD format
    
    Returns:
    - DataFrame containing the historical air quality data
    """
    base_url = "https://aqs.epa.gov/data/api/sampleData/bysite"
    
    params = {
        "email": email,
        "key": api_key,
        "param": parameter_code,
        "bdate": start_date,
        "edate": end_date,
        "state": state_code,
        "county": county_code,
        "site": site_code
    }
    
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        if data['Header'][0]['status'] != 'Success':
            print(f"Error: {data['Header'][0]['message']}")
            return None
        
        if not data['Data']:
            print(f"No data found for the specified parameters.")
            return None
        
        # Convert to DataFrame
        df = pd.DataFrame(data['Data'])
        return df
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None

def save_data(df, state_code, county_code, site_code, parameter_code, start_date, end_date):
    """
    Save the historical air quality data to a CSV file.
    
    Parameters:
    - df (DataFrame): The data to save
    - state_code (str): Two-digit state code
    - county_code (str): Three-digit county code
    - site_code (str): Four-digit site code
    - parameter_code (str): Five-digit parameter code
    - start_date (str): Start date in YYYYMMDD format
    - end_date (str): End date in YYYYMMDD format
    """
    if df is None or df.empty:
        print("No data to save.")
        return
    
    # Create data directory if it doesn't exist
    os.makedirs("air_quality_data", exist_ok=True)
    
    # Create filename with location and date info
    filename = f"air_quality_data/epa_{state_code}_{county_code}_{site_code}_{parameter_code}_{start_date}_{end_date}.csv"
    
    # Save to CSV
    df.to_csv(filename, index=False)
    print(f"Data saved to {filename}")

def main():
    # Your EPA API credentials
    EMAIL = "your_registered_email@example.com"
    API_KEY = "YOUR_EPA_API_KEY"
    
    # Common air quality parameters
    parameters = {
        "Ozone": "44201",
        "PM2.5": "88101",
        "PM10": "81102",
        "NO2": "42602",
        "SO2": "42401",
        "CO": "42101"
    }
    
    # List of monitoring sites (state, county, site)
    monitoring_sites = [
        # New York, Queens College site
        {"state": "36", "county": "081", "site": "0124", "name": "Queens_NY"},
        # California, Los Angeles-North Main Street site
        {"state": "06", "county": "037", "site": "1103", "name": "LosAngeles_CA"},
        # Texas, Houston Deer Park site
        {"state": "48", "county": "201", "site": "1039", "name": "Houston_TX"}
    ]
    
    # Date range (past 30 days)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    start_date_str = start_date.strftime("%Y%m%d")
    end_date_str = end_date.strftime("%Y%m%d")
    
    for site in monitoring_sites:
        for param_name, param_code in parameters.items():
            print(f"Fetching {param_name} data for {site['name']}...")
            
            df = fetch_epa_data(
                EMAIL, API_KEY, 
                site["state"], site["county"], site["site"],
                param_code, start_date_str, end_date_str
            )
            
            save_data(
                df, site["state"], site["county"], site["site"],
                param_code, start_date_str, end_date_str
            )
            
            # Add a short delay to avoid hitting rate limits
            time.sleep(2)
            
        print(f"Completed for {site['name']}\n")

if __name__ == "__main__":
    main()