"use client";

import { useState } from "react";
import { Calendar, Loader2, AlertCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { getApiUrl } from "@/lib/api";

export default function WeeklyPrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [weekNumber, setWeekNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weekNumber || parseInt(weekNumber) < 1 || parseInt(weekNumber) > 52) {
      setError("Please enter a valid week number (1-52)");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const endpoint = getApiUrl('/api/predict_week');

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ week: weekNumber }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Prediction failed");
      }

      const data = await response.json();
      setResult(data.prediction || data.message || "Prediction completed");
    } catch (err: any) {
      setError(err.message || "Failed to predict. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
            <Calendar className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">Time-Based Forecasting</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Weekly Prediction
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get pest predictions for any week of the year
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Week Number (1-52)
                </label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={weekNumber}
                  onChange={(e) => {
                    setWeekNumber(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  placeholder="Enter week number (e.g., 25)"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter a week number between 1 and 52 to get pest predictions for that week
                </p>
              </div>

              {/* Week Reference Guide */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Quick Reference
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-purple-800">
                  <div>Week 1-13: Jan-Mar</div>
                  <div>Week 14-26: Apr-Jun</div>
                  <div>Week 27-39: Jul-Sep</div>
                  <div>Week 40-52: Oct-Dec</div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              {result && (
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-green-900 text-lg">Prediction for Week {weekNumber}</h3>
                  </div>
                  <p className="text-green-800 text-lg">{result}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Predicting...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    <span>Get Weekly Prediction</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-3">How it works</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Our AI model analyzes historical pest data patterns for each week
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Predictions consider seasonal variations and pest lifecycle patterns
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Use this tool to plan preventive measures ahead of time
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
