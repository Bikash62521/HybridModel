import os
import sys

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC  # Required for joblib

# --- 1. Define File Paths (relative to project root) ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CNN_MODEL_PATH = os.path.join(BASE_DIR, 'models', 'epilepsy_cnn_model_v3.h5')
SVM_MODEL_PATH = os.path.join(BASE_DIR, 'models', 'svm_model_v3.gz')
SCALER_PATH = os.path.join(BASE_DIR, 'models', 'epilepsy_scaler_v3.gz')

# --- 2. Define the 5-Class Labels ---
label_map = {
    1: "1 - Seizure Activity",
    2: "2 - Tumor Area",
    3: "3 - Healthy Area (Tumor Patient)",
    4: "4 - Eyes Closed (Healthy)",
    5: "5 - Eyes Open (Healthy)"
}

#  3. Initialize the Flask App 
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])  # Allow Next.js dev server

#  4. Load All Models
feature_extractor = None
svm_model = None
scaler = None

@app.before_request
def load_models_once():
    # This hook loads models before the first request
    global feature_extractor, svm_model, scaler
    if svm_model is None:  # Only load if they haven't been loaded
        print("Loading all models...")
        cnn_model = keras.models.load_model(CNN_MODEL_PATH, compile=False)
        feature_layer_name = cnn_model.layers[-4].name
        feature_extractor = keras.Model(
            inputs=cnn_model.inputs,
            outputs=cnn_model.get_layer(feature_layer_name).output,
        )
        svm_model = joblib.load(SVM_MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        print("All models loaded successfully.")

#  5. Main Prediction Function 
def run_full_prediction(df):
    data_to_scale = df.copy()
    original_y = None
    if 'y' in data_to_scale.columns:
        original_y = data_to_scale['y']
        data_to_scale = data_to_scale.drop(columns=['y'])
    if 'Unnamed' in data_to_scale.columns:
        data_to_scale = data_to_scale.drop(columns=['Unnamed'])
    
    new_X_scaled = scaler.transform(data_to_scale)
    new_X_reshaped = new_X_scaled.reshape(new_X_scaled.shape[0], new_X_scaled.shape[1], 1)
    smart_features = feature_extractor.predict(new_X_reshaped)
    predictions_0based = svm_model.predict(smart_features)
    
    results = []
    counts = {label: 0 for label in label_map.values()}
    
    for i, pred in enumerate(predictions_0based):
        pred_class_1based = int(pred) + 1
        label_text = label_map[pred_class_1based]
        
        result_row = {
            "Sample_Number": i + 1,
            "Predicted_Class": pred_class_1based,
            "Prediction_Label": label_text
        }
        
        counts[label_text] += 1
        
        if original_y is not None:
            result_row["Actual_Answer_Class"] = int(original_y.iloc[i])
            result_row["Actual_Answer_Label"] = label_map[original_y.iloc[i]]
            
        results.append(result_row)
        
    # Return both the full results and the summary counts
    return {"full_results": results, "summary_counts": counts}

#  6. Create the API Endpoint
@app.route('/predict', methods=['POST'])
def predict_endpoint():
    try:
        file = request.files['csv_file']
        if not file:
            return jsonify({"error": "No file uploaded."}), 400

        df = pd.read_csv(file)
        predictions = run_full_prediction(df)
        return jsonify(predictions)  # Send JSON results to the frontend

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#  7. Run the App 
if __name__ == '__main__':
    print("Starting Flask server... API available at http://127.0.0.1:5000")
    app.run(debug=False, port=5000)  # Runs on http://127.0.0.1:5000
