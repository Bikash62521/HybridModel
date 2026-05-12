import os
import sys

import pandas as pd
import requests
import matplotlib.pyplot as plt
import seaborn as sns

print("--- Step 1: All client libraries imported. ---")

# 2. DEFINE LOCAL PATHS (relative to project root)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NEW_DATA_PATH = os.path.join(BASE_DIR, 'data', 'sample', 'untrained_data_for_prediction.csv')
EXCEL_OUTPUT_PATH = os.path.join(BASE_DIR, 'output', 'hybrid_prediction_results_5_class.xlsx')
CHART_OUTPUT_PATH = os.path.join(BASE_DIR, 'output', 'prediction_chart.png')
API_URL = 'http://127.0.0.1:5000/predict'

print("--- Step 2: File paths and API URL are set. ---")

# Ensure output directory exists
os.makedirs(os.path.join(BASE_DIR, 'output'), exist_ok=True)

# 3. SEND TO API
try:
    print(f"Sending new data from {NEW_DATA_PATH} to {API_URL}...")
    
    with open(NEW_DATA_PATH, 'rb') as f:
        # Use requests to send the file as multipart/form-data
        response = requests.post(API_URL, files={'csv_file': f})
        
    if response.status_code != 200:
        print(f"API Error: {response.status_code} - {response.text}")
        sys.exit(1)
        
    print("Prediction successful from API.")
    data = response.json()
    
    # 4. PROCESS RESULTS
    full_results = data.get('full_results', [])
    summary_counts = data.get('summary_counts', {})
    
    if not full_results:
        print("No results returned from the API.")
        sys.exit(1)
        
    final_report_df = pd.DataFrame(full_results)
    
    print("\n--- Summary of All Predictions (The Number) ---")
    for label, count in summary_counts.items():
        print(f"{label}: {count}")

    print("\nCreating simple results file for Excel...")
    
    try:
        final_report_df.to_excel(EXCEL_OUTPUT_PATH, index=False)
        print(f"\n--- Successfully saved SIMPLE results to '{EXCEL_OUTPUT_PATH}' ---")
    except Exception as e:
        print(f"\nError saving to Excel: {e}")
    
    # 5. GENERATE PLOT (THE BAR CHART)
    print("\n--- Generating Prediction Summary Plot... ---")
    
    label_map = {
        1: "1 - Seizure Activity",
        2: "2 - Tumor Area",
        3: "3 - Healthy Area (Tumor Patient)",
        4: "4 - Eyes Closed (Healthy)",
        5: "5 - Eyes Open (Healthy)"
    }
    
    plt.figure(figsize=(10, 6))
    sns.countplot(x='Prediction_Label', data=final_report_df, order=label_map.values())
    plt.title('Prediction Results Summary (via API)')
    plt.xlabel('Predicted Label')
    plt.ylabel('Count')
    plt.xticks(rotation=45, ha='right')  # Rotate labels
    plt.tight_layout()
    plt.savefig(CHART_OUTPUT_PATH, dpi=150)
    print(f"Chart saved to '{CHART_OUTPUT_PATH}'")
    plt.show()
    
    # We only show accuracy if the 'Actual_Answer_Class' column was present
    if 'Actual_Answer_Class' in final_report_df.columns:
        print("\n--- Accuracy on New Data ---")
        accuracy = (final_report_df['Predicted_Class'] == final_report_df['Actual_Answer_Class']).mean()
        print(f"Accuracy: {accuracy * 100:.2f}%")

except FileNotFoundError as e:
    print(f"\nFATAL ERROR: A file was not found. Check your paths.")
    print(f"File not found error: {e}")
except requests.exceptions.ConnectionError:
    print(f"\nFATAL ERROR: Could not connect to the API at {API_URL}.")
    print("Please make sure api.py is running!")
except Exception as e:
    print(f"An error occurred: {e}")

print("\n--- Hybrid Prediction Script Finished. ---")
