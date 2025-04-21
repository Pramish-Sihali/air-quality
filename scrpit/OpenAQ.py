#!/usr/bin/env python3
"""
Air Quality Data Scraper for OpenAQ
This script fetches air pollution data from the OpenAQ API, which provides
open air quality data from around the world.

Requirements:
- requests
- pandas

Install with: pip install requests pandas
"""

import requests
import pandas as pd
from datetime import datetime
import os
import time

def fetch_openaq_data(country, city=None, parameter=None, limit=1000):
    """
    Fetch air quality data from OpenAQ API.
    
    Parameters:
    - country (str): Two-letter country code (e.g., 'US', 'IN', 'CN')
    - city (str, optional): City name
    - parameter (str, optional): Pollution parameter (pm25, pm10, co, so2, no2, o3, bc)
    - limit (int): Maximum number of results to retrieve
    
    Returns:
    - DataFrame containing the air quality data
    """
    base_url = "https://api.openaq.org/v2/measurements"
    
    params = {
        "country": country,
        "limit": limit,
        "has_geo": "true",  # Only include results with coordinates
        "order_by": "datetime"
    }
    
    if city:
        params["city"] = city
    
    if parameter:
        params["parameter"] = parameter
    
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        if not data['results']:
            print(f"No data found for country: {country}, city: {city}")
            return None
        
        # Convert to DataFrame
        df = pd.json_normalize(data['results'])
        return df
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None

def save_data(df, country, city=None, parameter=None):
    """
    Save the air quality data to a CSV file.
    
    Parameters:
    - df (DataFrame): The data to save
    - country (str): Country code
    - city (str, optional): City name
    - parameter (str, optional): Pollution parameter
    """
    if df is None or df.empty:
        print("No data to save.")
        return
    
    # Create data directory if it doesn't exist
    os.makedirs("air_quality_data", exist_ok=True)
    
    # Create filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    city_str = f"_{city}" if city else ""
    param_str = f"_{parameter}" if parameter else ""
    filename = f"air_quality_data/openaq_{country}{city_str}{param_str}_{timestamp}.csv"
    
    # Save to CSV
    df.to_csv(filename, index=False)
    print(f"Data saved to {filename}")

def main():
    # List of countries and cities to fetch data for
    locations = [
        {"country": "US", "city": "Los Angeles"},
        {"country": "IN", "city": "Delhi"},
        {"country": "CN", "city": "Beijing"},
        {"country": "GB", "city": "London"}
    ]
    
    # List of parameters to fetch
    parameters = ["pm25", "pm10", "no2", "o3"]
    
    for location in locations:
        country = location["country"]
        city = location.get("city")
        
        for param in parameters:
            print(f"Fetching {param} data for {city}, {country}...")
            df = fetch_openaq_data(country, city, param)
            save_data(df, country, city, param)
            
            # Add a short delay to avoid hitting rate limits
            time.sleep(1)
        
        print(f"Completed for {city}, {country}\n")

if __name__ == "__main__":
    main()