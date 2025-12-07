"use client";

import { useState } from "react";
import { Upload, Bug, Download, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PestWatch() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    pest_class: string;
    suggestion: string;
    annotated_image: string;
  } | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setError("");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setError("");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("/api/pestwatch_yolo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Detection failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to detect pests. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result?.annotated_image) {
      const link = document.createElement("a");
      link.href = result.annotated_image;
      link.download = "annotated_image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
            <Bug className="w-6 h-6 text-green-600" />
            <span className="text-sm font-semibold text-gray-700">AI-Powered Detection</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Pest Watch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload an image to detect pests using advanced YOLO AI model
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Upload Image</h2>
              
              <form onSubmit={handleSubmit}>
                {/* Drag and Drop Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer"
                >
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="fileInput" className="cursor-pointer">
                    {preview ? (
                      <div className="relative">
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg shadow-md"
                        />
                        <div className="mt-4 text-sm text-gray-600">
                          Click or drag to change image
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                          Drag & drop your image here
                        </p>
                        <p className="text-sm text-gray-500">
                          or click to browse (JPG, PNG, GIF)
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedFile || loading}
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <>
                      <Bug className="w-5 h-5" />
                      <span>Detect Pests</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Detection Results</h2>
              
              {result ? (
                <div className="space-y-6">
                  {/* Annotated Image */}
                  {result.annotated_image && (
                    <div>
                      <img
                        src={result.annotated_image}
                        alt="Annotated result"
                        className="w-full rounded-lg shadow-md"
                      />
                    </div>
                  )}

                  {/* Pest Class */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Detected Pest</h3>
                    <p className="text-green-800">{result.pest_class}</p>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Recommendations</h3>
                    <p className="text-blue-800 whitespace-pre-line">{result.suggestion}</p>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Annotated Image</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Bug className="w-24 h-24 mb-4" />
                  <p className="text-lg">Upload an image to see detection results</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
