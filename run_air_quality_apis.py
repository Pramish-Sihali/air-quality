# run_air_quality_apis.py
import subprocess
import os
import json
import datetime
import argparse
from pathlib import Path

def ensure_directory(directory):
    """Create directory if it doesn't exist."""
    Path(directory).mkdir(parents=True, exist_ok=True)

def run_script(script_name, data_dir):
    """Run a specific API script with appropriate parameters."""
    script_path = os.path.join("script", script_name)  # Corrected folder name
    print(f"Running {script_name}...")
    
    try:
        # Pass data directory as environment variable
        env = os.environ.copy()
        env["DATA_DIR"] = data_dir
        
        # Run the script and capture output
        result = subprocess.run(
            ["python3", script_path], 
            env=env,
            capture_output=True, 
            text=True,
            check=True
        )
        print(f"✅ {script_name} completed successfully")
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running {script_name}: {e}")
        print(f"Error output: {e.stderr}")
        return False, e.stderr

def save_metadata(data_dir, results):
    """Save metadata about the API runs."""
    metadata = {
        "last_updated": datetime.datetime.now().isoformat(),
        "api_results": results
    }
    
    with open(os.path.join(data_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)

def main():
    parser = argparse.ArgumentParser(description="Run air quality API scripts")
    parser.add_argument("--data-dir", default="./data/api_data", 
                        help="Directory to store API data")
    args = parser.parse_args()
    
    # Ensure data directory exists
    ensure_directory(args.data_dir)
    
    # List of scripts to run
    scripts = [
        "AirNow.py",
        "EPA.py", 
        "OpenAQ.py",
        "WAQI.py"
    ]
    
    # Run each script and collect results
    results = {}
    for script in scripts:
        success, output = run_script(script, args.data_dir)
        results[script] = {
            "success": success,
            "timestamp": datetime.datetime.now().isoformat()
        }
    
    # Save metadata
    save_metadata(args.data_dir, results)
    
    print("\nAll scripts completed! Data saved to:", args.data_dir)
    return results

if __name__ == "__main__":
    main()