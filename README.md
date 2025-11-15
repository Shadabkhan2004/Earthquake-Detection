# Earthquake Event Detection using CNN–LSTM

This project detects seismic events and estimates **P-wave** and **S-wave arrival times** from **60-second, 3-channel waveform segments** or **.wav files** using a **multi-output CNN–LSTM deep learning model**.  
It is based on the **STEAD** dataset and includes an **interactive web interface** built with **FastAPI + React**.

---

## Example Prediction

Below is a snapshot of the `/predict` page — the model detected an **earthquake event** and predicted its **P** and **S** arrival times:

![Prediction Example](./images/earthquake1.png)

---

## Overview

- **Input:** 60-second, 3-channel seismic waveform (or `.wav` file) converted into **STFT spectrograms**.  
- **Outputs:**
  - `event_output` → Probability of an earthquake event  
  - `p_output` → Predicted P-wave arrival time (in seconds)  
  - `s_output` → Predicted S-wave arrival time (in seconds)  
- **Architecture:** 3 CNN layers for spatial feature extraction + 1 LSTM layer for temporal modeling.

---

## Model Performance (Test Set)

| Metric | Value |
|--------|-------:|
| Precision | 0.977 |
| Recall | 0.996 |
| F1 Score | 0.987 |
| AUC | 0.992 |
| P-wave MAE | 0.0555 |
| P-wave RMSE | 0.0704 |
| S-wave MAE | 0.2358 |
| S-wave RMSE | 0.3457 |

---

## Visualizations

- Confusion Matrix  
- Precision–Recall and ROC Curves  
- Event Probability Distributions  
- P/S Arrival Scatter Plots  
- **Grad-CAM Heatmap** → highlights waveform regions the model focused on during event detection

---

## Frontend + Backend

- **Backend:** FastAPI endpoint `/predict` loads the trained model (`cnn_lstm_multi_model`) and performs real-time inference.  
- **Frontend:** React UI with file upload and result visualization.  
  - Displays event probability  
  - Only outputs P/S arrival predictions if the event probability exceeds threshold (default 0.6)  

---

## Making a New Model Where the Loss is Only Considered for Earthquake Labels
#### Model Performance (Test Set)

| Metric      | Value   |
|------------|--------:|
| Precision  | 0.9988 |
| Recall     | 0.9907 |
| F1 Score   | 0.9947 |
| AUC        | 0.9998 |
| P-wave MAE | 0.0329 |
| P-wave RMSE| 0.0410 |
| S-wave MAE | 0.3548 |
| S-wave RMSE| 0.4787 |

---
## Previous Model (Baseline CNN)

Before developing the multi-output CNN–LSTM, a simpler **CNN classifier** was trained to distinguish between **earthquake_local** and **noise** samples using spectrograms.

**Architecture Highlights:**
- 3 convolutional layers + global average pooling  
- Binary classification (`Noise` vs `Earthquake`)  
- Loss: Binary Crossentropy  
- Optimizer: Adam  

**Performance:**
| Metric | Value |
|--------|-------:|
| Test Accuracy | 0.9975 |
| Test Loss | 0.0141 |

**Confusion Matrix:**
[[3106 5]
[ 13 4190]]

---

## Tech Stack

- **Python**, **TensorFlow / Keras**
- **FastAPI**
- **React.js**, **Tailwind CSS**
- **NumPy**, **Matplotlib**, **Seaborn**, **scikit-learn**

---

## Future Work

- Experiment with CNN + Transformer hybrid architectures  
- Improve arrival-time precision    

---

## License
This project is for academic and research purposes.
