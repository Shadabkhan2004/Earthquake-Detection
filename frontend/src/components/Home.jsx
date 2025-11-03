import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white flex flex-col items-center justify-center px-6 py-12">
      
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Earthquake Prediction System
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          This AI-powered system predicts whether seismic signals indicate an
          <span className="text-cyan-400 font-semibold"> earthquake event</span>, 
          and estimates the arrival times of 
          <span className="text-blue-400 font-semibold"> P-waves</span> and 
          <span className="text-purple-400 font-semibold"> S-waves</span> — 
          crucial for early warning and disaster preparedness.
        </p>
      </motion.div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        
        {/* Card 1 - Event Detection */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 text-center shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">
            Earthquake Event Detection
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            The model predicts the <span className="text-cyan-300 font-semibold">probability of an earthquake </span> 
            based on real-time seismic waveform data. This helps identify 
            whether the detected signal corresponds to an actual seismic event.
          </p>
        </motion.div>

        {/* Card 2 - P-wave Arrival */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 text-center shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-blue-400 mb-3">
            P-Wave Arrival Prediction
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            P-waves are the <span className="text-blue-300 font-semibold">first waves</span> to reach sensors.
            The system estimates their arrival time, giving the first sign that
            an earthquake is occurring.
          </p>
        </motion.div>

        {/* Card 3 - S-wave Arrival */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 text-center shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-purple-400 mb-3">
            S-Wave Arrival Prediction
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            S-waves carry the <span className="text-purple-300 font-semibold">most destructive energy</span>. 
            Predicting their arrival provides crucial seconds of advance warning
            for emergency systems and evacuation protocols.
          </p>
        </motion.div>
      </div>

      {/* Footer / Description */}
      <div className="mt-12 max-w-3xl text-center text-gray-400 text-sm leading-relaxed">
        <p>
          This project integrates <span className="text-cyan-300 font-semibold">deep learning </span> 
          (CNN + LSTM) to analyze seismic signals. By recognizing subtle patterns 
          in waveform data, it delivers real-time predictions of event probability 
          and wave arrivals — empowering next-generation early warning systems.
        </p>
      </div>

      {/* Navigate to Prediction Page */}
      <motion.button
        onClick={() => navigate("/predict")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-10 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition"
      >
        Predict
      </motion.button>
    </div>
  );
};

export default Home;
