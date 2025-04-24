#!/usr/bin/env python3
"""
Air Quality Data Scraper for WAQI (World Air Quality Index)
This script scrapes air pollution data from the WAQI website, which provides
real-time air quality information for cities around the world.

Requirements:
- requests
- beautifulsoup4
- pandas

Install with: pip install requests beautifulsoup4 pandas
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
from datetime import datetime
import os
import time
import random

def fetch_waqi_data(city):
    """
    Scrape air quality data from WAQI website for a specific city.
    
    Parameters:
    - city (str): Name of the city
    
    Returns:
    - Dictionary containing the air quality data
    """
    # Format city name for URL
    city_formatted = city.lower().replace(" ", "-")
    url = f"https://aqicn.org/city/{city_formatted}/"
    
    # Add headers to mimic a browser request
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract AQI value
        aqi_div = soup.find('div', {'id': 'aqiwgtvalue'})
        if not aqi_div:
            print(f"Could not find AQI value for {city}")
            return None
        
        aqi_value = aqi_div.text.strip()
        
        # Extract pollutant data
        data = {
            'city': city,
            'aqi': aqi_value,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Find detailed pollutant data
        pollutant_table = soup.find('table', {'id': 'aqitable'})
        if pollutant_table:
            rows = pollutant_table.find_all('tr')
            for row in rows:
                cols = row.find_all('td')
                if len(cols) >= 2:
                    pollutant = cols[0].text.strip().lower()
                    value = cols[1].text.strip()
                    data[pollutant] = value
        
        return data
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for {city}: {e}")
        return None

def save_data_to_csv(data_list):
    """
    Save a list of air quality data dictionaries to a CSV file.
    
    Parameters:
    - data_list (list): List of dictionaries containing air quality data
    """
    if not data_list:
        print("No data to save.")
        return
    
    # Create data directory if it doesn't exist
    os.makedirs("air_quality_data", exist_ok=True)
    
    # Create filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"air_quality_data/waqi_data_{timestamp}.csv"
    
    # Convert to DataFrame and save to CSV
    df = pd.DataFrame(data_list)
    df.to_csv(filename, index=False)
    print(f"Data saved to {filename}")

def main():
    # List of cities to scrape
    cities = [
        "Beijing",
        "Delhi",
        "London",
        "Los Angeles",
        "Mexico City",
        "Mumbai",
        "Paris",
        "São Paulo",
        "Shanghai",
        "Tokyo"
    ]
    
    data_list = []
    
    for city in cities:
        print(f"Scraping data for {city}...")
        data = fetch_waqi_data(city)
        
        if data:
            data_list.append(data)
            print(f"Successfully scraped data for {city}")
        
        # Random delay between requests to avoid overloading the server
        delay = random.uniform(3, 7)
        print(f"Waiting {delay:.2f} seconds before next request...")
        time.sleep(delay)
    
    print("\nSaving all data to CSV...")
    save_data_to_csv(data_list)
    print("Done!")

if __name__ == "__main__":
    main()