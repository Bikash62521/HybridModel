# 🧠 NeuroSentry — EEG Hybrid CNN+SVM Classifier

A hybrid deep learning system that classifies EEG (Electroencephalogram) brain signals into **5 categories** using a **CNN feature extractor** combined with an **SVM classifier**. Built with a Flask API backend and a Next.js frontend.

---

## 📌 About the Project

This project implements a **Hybrid CNN + SVM model** for classifying EEG signals. Instead of using a CNN alone for classification, we use the CNN as a **feature extractor** — it learns meaningful patterns from raw EEG data — and then feed those extracted features into an **SVM (Support Vector Machine)** for final classification. This hybrid approach often outperforms standalone models.

### Why Hybrid?

| Approach | Limitation |
|----------|-----------|
| CNN alone | May overfit on small medical datasets |
| SVM alone | Cannot learn complex features from raw signals |
| **CNN + SVM (Hybrid)** | **CNN extracts deep features, SVM classifies with better generalization** |

---

## 📊 Dataset

This project uses the **Epileptic Seizure Recognition Dataset** from Kaggle.

🔗 **Kaggle Link:** [https://www.kaggle.com/datasets/harunshimanto/epileptic-seizure-recognition](https://www.kaggle.com/datasets/harunshimanto/epileptic-seizure-recognition)

### Dataset Details

| Property | Value |
|----------|-------|
| **Source** | University of Bonn, Germany |
| **Total Samples** | 11,500 |
| **Features per Sample** | 178 (EEG signal readings: X1 to X178) |
| **Target Column** | `y` (class label: 1 to 5) |
| **File Format** | CSV |

### What is EEG?

EEG (Electroencephalogram) records electrical activity of the brain. Each sample in the dataset is a **1-second EEG recording** with **178 data points** (sampled at 178 Hz). The values represent voltage readings from electrodes placed on the scalp.

### Classification Labels

| Class (`y`) | Label | Description |
|:-----------:|-------|-------------|
| 1 | 🔴 Seizure Activity | EEG recorded during an epileptic seizure |
| 2 | 🟠 Tumor Area | EEG from the area where the tumor is located |
| 3 | 🟡 Healthy Area (Tumor Patient) | EEG from a healthy brain area of a tumor patient |
| 4 | 🔵 Eyes Closed (Healthy) | EEG from a healthy volunteer with eyes closed |
| 5 | 🟢 Eyes Open (Healthy) | EEG from a healthy volunteer with eyes open |

### CSV Format

Your CSV file must follow this format to work with the model:

```
X1, X2, X3, ... X178
72,  54,  28, ... -24
15,  23,  24, ... 18
...
```

- **178 columns** named `X1` through `X178` (EEG signal values)
- Each row = one EEG sample (1-second brain recording)
- An optional `y` column can be included for accuracy comparison (the model will ignore it during prediction and use it only for evaluation)
- A sample CSV file is included at `data/sample/untrained_data_for_prediction.csv`

---

## 📁 Project Structure

```
HybridModel/
├── backend/
│   ├── api.py                              # Flask API server
│   └── predict.py                          # CLI prediction script
├── models/
│   ├── epilepsy_cnn_model_v3.h5            # Pre-trained CNN model (~10 MB)
│   ├── svm_model_v3.gz                     # Pre-trained SVM classifier
│   └── epilepsy_scaler_v3.gz               # Feature scaler
├── data/
│   └── sample/
│       └── untrained_data_for_prediction.csv   # Sample test data (78 samples)
├── frontend/                               # Next.js web interface
│   ├── app/
│   │   ├── components/                     # React components
│   │   ├── page.js                         # Main page
│   │   └── layout.js                       # Root layout
│   ├── package.json
│   └── ...
├── requirements.txt                        # Python dependencies
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Python** 3.9 or higher
- **Node.js** 18 or higher
- **pip** (Python package manager)

### 1. Clone the Repository

```bash
git clone https://github.com/Bikash62521/HybridModel.git
cd HybridModel
```

### 2. Set Up the Python Backend

```bash
# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Start the API Server

```bash
python backend/api.py
```

The API will be available at `http://127.0.0.1:5000`.

### 4. Set Up & Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### 5. Use the Application

1. Open `http://localhost:3000` in your browser
2. Upload a CSV file with EEG data (178 features per sample)
3. Click predict — the model will classify each sample into one of 5 categories
4. View results in a dashboard with charts and a detailed table

---

## 🧪 Using Your Own Dataset

### Option 1: Download from Kaggle

1. Go to [Kaggle: Epileptic Seizure Recognition](https://www.kaggle.com/datasets/harunshimanto/epileptic-seizure-recognition)
2. Download the dataset CSV file
3. The file contains columns: `Unnamed`, `X1` to `X178`, and `y`
4. You can upload this file directly — the model will automatically handle the extra columns

### Option 2: Prepare Your Own EEG Data

If you have custom EEG data, format it as a CSV with:
- **178 columns** of numerical EEG signal values (named `X1` to `X178`)
- Each row represents one EEG sample
- No header formatting required beyond column names

### Option 3: Use the Included Sample

A sample file with 78 EEG recordings is included at:
```
data/sample/untrained_data_for_prediction.csv
```

---

## 🖥️ CLI Predictions (Optional)

You can also run predictions directly from the command line (the API server must be running):

```bash
python backend/predict.py
```

This will:
- Send the sample data to the API
- Print prediction results in the terminal
- Save results as an Excel file in `output/hybrid_prediction_results_5_class.xlsx`
- Generate a bar chart in `output/prediction_chart.png`

---

## 📡 API Endpoint

### `POST /predict`

Upload a CSV file for classification.

**Request:** `multipart/form-data` with field `csv_file`

**Example using cURL:**
```bash
curl -X POST -F "csv_file=@your_data.csv" http://127.0.0.1:5000/predict
```

**Response:**
```json
{
  "full_results": [
    {
      "Sample_Number": 1,
      "Predicted_Class": 5,
      "Prediction_Label": "5 - Eyes Open (Healthy)"
    },
    {
      "Sample_Number": 2,
      "Predicted_Class": 1,
      "Prediction_Label": "1 - Seizure Activity"
    }
  ],
  "summary_counts": {
    "1 - Seizure Activity": 10,
    "2 - Tumor Area": 15,
    "3 - Healthy Area (Tumor Patient)": 18,
    "4 - Eyes Closed (Healthy)": 20,
    "5 - Eyes Open (Healthy)": 15
  }
}
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Feature Extraction | TensorFlow / Keras CNN |
| Classification | scikit-learn SVM |
| Data Scaling | scikit-learn StandardScaler |
| API | Flask + Flask-CORS |
| Frontend | Next.js + React + Tailwind CSS |
| Data Processing | pandas, NumPy |
| Visualization | matplotlib, seaborn, Chart.js |

---

## 🔬 How the Model Works

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐     ┌──────────────┐
│  Raw EEG     │────▶│  StandardScaler  │────▶│  CNN Feature │────▶│  SVM          │
│  Data (178)  │     │  (Normalize)     │     │  Extractor   │     │  Classifier   │
└─────────────┘     └──────────────────┘     └─────────────┘     └──────┬───────┘
                                                                        │
                                                                        ▼
                                                               ┌──────────────┐
                                                               │  Predicted   │
                                                               │  Class (1-5) │
                                                               └──────────────┘
```

1. **Input:** Raw EEG signal (178 numerical values)
2. **Scaling:** StandardScaler normalizes the data
3. **Feature Extraction:** CNN extracts meaningful features from the signal
4. **Classification:** SVM classifies the features into one of 5 categories
5. **Output:** Predicted class with label

---

## 📄 License

This project is for educational and research purposes.

---

## 🤝 Acknowledgements

- **Dataset:** [Epileptic Seizure Recognition - Kaggle](https://www.kaggle.com/datasets/harunshimanto/epileptic-seizure-recognition)
- **Original Data Source:** University of Bonn, Germany
