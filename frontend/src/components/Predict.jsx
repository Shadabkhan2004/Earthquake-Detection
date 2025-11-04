import React, { useState } from "react";
import { motion } from "framer-motion";

const Predict = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handlePredict = async () => {
    if (!file) {
      setError("Please upload a .wav file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Prediction failed. Check your FastAPI server or file format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex flex-col items-center justify-center px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
      >
        Earthquake Prediction
      </motion.h1>

      {/* Upload Section */}
      <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 shadow-xl w-full max-w-lg text-center">
        <p className="text-gray-300 mb-4">
          Upload a <span className="text-cyan-400 font-semibold">.wav</span> seismic waveform file to analyze.
        </p>

        <input
          type="file"
          accept=".wav"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-300 border border-gray-700 rounded-lg cursor-pointer bg-gray-900 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePredict}
          disabled={loading}
          className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition disabled:opacity-50"
        >
          {loading ? "Predicting..." : "Predict"}
        </motion.button>

        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>

      {/* Result Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`mt-10 grid ${
            result.event_detected ? "md:grid-cols-3" : "md:grid-cols-1"
          } grid-cols-1 gap-6 max-w-5xl`}
        >
          {/* Event Probability */}
          <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700 text-center shadow-lg">
            <h3 className="text-cyan-400 font-semibold text-lg mb-2">
              Event Probability
            </h3>
            <p className="text-2xl font-bold text-white">
              {(result.event_probability * 100).toFixed(2)}%
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {result.event_detected
                ? "Earthquake detected"
                : "No event detected"}
            </p>
          </div>

          {/* Show P & S waves only when event is detected */}
          {result.event_detected && (
            <>
              <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700 text-center shadow-lg">
                <h3 className="text-blue-400 font-semibold text-lg mb-2">
                  P-Wave Onset
                </h3>
                <p className="text-2xl font-bold text-white">
                  {result.p_prediction?.toFixed(2)} s
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Predicted P-wave arrival time
                </p>
              </div>

              <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700 text-center shadow-lg">
                <h3 className="text-purple-400 font-semibold text-lg mb-2">
                  S-Wave Onset
                </h3>
                <p className="text-2xl font-bold text-white">
                  {result.s_prediction?.toFixed(2)} s
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Predicted S-wave arrival time
                </p>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Predict;
