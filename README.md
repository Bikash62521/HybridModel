# 🧠 NeuroSentry — EEG Hybrid CNN+SVM Classifier

A hybrid deep learning system that classifies EEG brain signals into 5 categories using a **CNN feature extractor** combined with an **SVM classifier**. Built with a Flask API backend and a Next.js frontend.

## 📁 Project Structure

```
HybridModel/
├── backend/
│   ├── api.py              # Flask API server
│   └── predict.py          # CLI prediction script
├── models/
│   ├── epilepsy_cnn_model_v3.h5   # Trained CNN model
│   ├── svm_model_v3.gz            # Trained SVM classifier
│   └── epilepsy_scaler_v3.gz      # Feature scaler
├── data/
│   └── sample/
│       └── untrained_data_for_prediction.csv  # Sample test data
├── frontend/               # Next.js web interface
│   ├── app/
│   │   ├── components/     # React components
│   │   ├── page.js         # Main page
│   │   └── layout.js       # Root layout
│   ├── package.json
│   └── ...
├── requirements.txt        # Python dependencies
├── .gitignore
└── README.md
```

## 🏷️ Classification Labels

| Class | Label |
|-------|-------|
| 1 | Seizure Activity |
| 2 | Tumor Area |
| 3 | Healthy Area (Tumor Patient) |
| 4 | Eyes Closed (Healthy) |
| 5 | Eyes Open (Healthy) |

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/HybridModel.git
cd HybridModel
```

### 2. Set Up the Python Backend

```bash
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Start the API Server

```bash
python backend/api.py
```

The API will be available at `http://127.0.0.1:5000`.

### 4. Set Up the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### 5. (Optional) Run CLI Predictions

With the API server running, you can also run predictions from the command line:

```bash
python backend/predict.py
```

Results will be saved to the `output/` directory.

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Feature Extraction | TensorFlow / Keras CNN |
| Classification | scikit-learn SVM |
| API | Flask |
| Frontend | Next.js + React |
| Data Processing | pandas, NumPy |
| Visualization | matplotlib, seaborn, Chart.js |

## 📊 API Endpoint

### `POST /predict`

Upload a CSV file for classification.

**Request:** `multipart/form-data` with field `csv_file`

**Response:**
```json
{
  "full_results": [
    {
      "Sample_Number": 1,
      "Predicted_Class": 5,
      "Prediction_Label": "5 - Eyes Open (Healthy)"
    }
  ],
  "summary_counts": {
    "1 - Seizure Activity": 0,
    "2 - Tumor Area": 0,
    ...
  }
}
```
