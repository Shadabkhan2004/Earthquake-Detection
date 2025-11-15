from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
import io
import soundfile as sf
from scipy.signal import stft
import tensorflow as tf
import os



FS = 100
EXPECTED_WIDTH = 95
EVENT_THRESHOLD = 0.5
MODEL_DIR = "../models/cnn_lstm_multi_model_fixedmask"



def masked_mse(y_true, y_pred):
  event = y_true[:, 0]        
  arrival = y_true[:, 1]      

  mask = tf.cast(event > 0, tf.float32)  
  sq_err = tf.square(arrival - y_pred[:, 0]) * mask

  return tf.reduce_sum(sq_err) / (tf.reduce_sum(mask) + 1e-6)



def load_model(path=MODEL_DIR):
  if not os.path.exists(path):
    raise FileNotFoundError(f"Model not found at {path}")
  return tf.keras.models.load_model(path, custom_objects={"masked_mse": masked_mse})



def preprocess_waveform(waveform, fs=100):
  if waveform.ndim == 1:
    waveform = np.tile(waveform[:, None], (1, 3))
  elif waveform.shape[1] != 3:
    raise ValueError("Expected 3 channels")

  waveform = (waveform - waveform.mean(axis=0)) / (waveform.std(axis=0) + 1e-6)
  specs = []

  for ch in range(3):
    f, t, Zxx = stft(waveform[:, ch], fs=fs, nperseg=128, noverlap=64, nfft=128)
    Sxx = np.abs(Zxx)
    Sxx = (Sxx - Sxx.min()) / (Sxx.max() - Sxx.min() + 1e-6)
    specs.append(Sxx)

  spec = np.stack(specs, axis=-1).astype(np.float32)
  current_width = spec.shape[1]

  if current_width < EXPECTED_WIDTH:
    pad_width = EXPECTED_WIDTH - current_width
    spec = np.pad(spec, ((0, 0), (0, pad_width), (0, 0)), mode='constant')
  elif current_width > EXPECTED_WIDTH:
    spec = spec[:, :EXPECTED_WIDTH, :]

  return np.expand_dims(spec, axis=0)


app = FastAPI(title="Earthquake Detection API")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)



try:
  model = load_model()
  print("Model loaded successfully")
except Exception as e:
  print(f"Failed to load model: {e}")
  model = None



@app.get("/")
def home():
    return {"message": "Earthquake Prediction API is running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
  if model is None:
    raise HTTPException(status_code=500, detail="Model not loaded.")

  contents = await file.read()
  try:
    waveform, samplerate = sf.read(io.BytesIO(contents), dtype='float32')
  except Exception as e:
    raise HTTPException(status_code=400, detail=f"Invalid file: {e}")

  if samplerate != FS:
    raise HTTPException(status_code=400, detail=f"Expected {FS} Hz sampling rate, got {samplerate} Hz")

  spec = preprocess_waveform(waveform)
  preds = model.predict(spec)
  event_pred, p_pred, s_pred = preds

  event_prob = float(event_pred[0][0])
  event_detected = bool(event_prob > EVENT_THRESHOLD)

  response = {
    "event_probability": round(event_prob, 4),
    "event_detected": event_detected,
  }

  # Only include P/S predictions if event is detected
  if event_detected:
    p_val = float(p_pred[0][0]) * 60
    s_val = float(s_pred[0][0]) * 60
    response.update({
      "p_prediction": round(p_val, 4),
      "s_prediction": round(s_val, 4),
    })

  return response



if __name__ == "__main__":
  uvicorn.run(app, host="0.0.0.0", port=8000)
