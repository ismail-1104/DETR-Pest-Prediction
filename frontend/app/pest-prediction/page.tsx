"use client";

import { useState } from "react";
import { LineChart, Loader2, AlertCircle, Bug } from "lucide-react";
import { motion } from "framer-motion";
import { getApiUrl } from "@/lib/api";

export default function PestPrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    feature1: "", // Collection Type
    feature2: "", // Max Temperature
    feature3: "", // Min Temperature
    feature4: "", // RH1 (Relative Humidity)
    feature5: "", // Geography
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const requiredFields = Object.keys(formData);
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const endpoint = getApiUrl('/api/pestpred');

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Prediction failed");
      }

      const data = await response.json();
      setResult(data.prediction || data.message || "Prediction completed");
    } catch (err: any) {
      setError(err.message || "Failed to predict pest. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
            <LineChart className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Environmental Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Pest Prediction
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Predict pest outbreaks based on environmental factors
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" title="Hill numbers provide a unified framework for the three most popular groups of diversity measures">
                    Collection Type
                  </label>
                  <input
                    type="text"
                    name="feature1"
                    value={formData.feature1}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter collection type"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" title="Enter the maximum temperature">
                    Max Temperature
                  </label>
                  <input
                    type="text"
                    name="feature2"
                    value={formData.feature2}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter maximum temperature"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" title="Enter the minimum temperature">
                    Min Temperature
                  </label>
                  <input
                    type="text"
                    name="feature3"
                    value={formData.feature3}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter minimum temperature"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" title="RH1 is Relative Humidity">
                    RH1
                  </label>
                  <input
                    type="text"
                    name="feature4"
                    value={formData.feature4}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter relative humidity"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" title="Geography is Area/Location">
                    Geography
                  </label>
                  <input
                    type="text"
                    name="feature5"
                    value={formData.feature5}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter area/location"
                    required
                  />
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
                    <Bug className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-green-900 text-lg">Prediction Result</h3>
                  </div>
                  <p className="text-green-800 text-lg">{result}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <LineChart className="w-5 h-5" />
                    <span>Predict Pest Outbreak</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
