"use client"

import { useState } from "react"
import { getPestDetectionResult } from "../../utils/mockData"

const SeverityBadge = ({ level }) => {
  const styles = {
    High:   "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-amber-100 text-amber-700 border-amber-200",
    Low:    "bg-green-100 text-green-700 border-green-200",
  }
  const icons = { High: "🔴", Medium: "🟡", Low: "🟢" }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[level]}`}>
      {icons[level]} {level} Severity
    </span>
  )
}

const PestDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [scanProgress, setScanProgress] = useState(0)
  const [activeTab, setActiveTab] = useState({}) // { pestId: "organic" | "chemical" }

  const scanSteps = [
    "Preprocessing image...",
    "Detecting crop boundaries...",
    "Running CNN model (AgroScan v2.1)...",
    "Matching pest signatures...",
    "Generating treatment report...",
  ]
  const [scanStep, setScanStep] = useState(0)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = () => {
    if (!selectedFile) return
    setLoading(true)
    setScanProgress(0)
    setScanStep(0)

    // Animate progress bar
    let progress = 0
    let step = 0
    const interval = setInterval(() => {
      progress += 4
      step = Math.floor((progress / 100) * scanSteps.length)
      setScanProgress(Math.min(progress, 98))
      setScanStep(Math.min(step, scanSteps.length - 1))
      if (progress >= 95) clearInterval(interval)
    }, 100)

    setTimeout(() => {
      clearInterval(interval)
      setScanProgress(100)
      const detections = getPestDetectionResult()
      setResult(detections)
      setLoading(false)
      // Default active tab for each result
      const tabs = {}
      detections.forEach((d, i) => { tabs[i] = "organic" })
      setActiveTab(tabs)
    }, 3000)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setScanProgress(0)
    setScanStep(0)
    setActiveTab({})
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">🔬</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pest & Disease Detection</h3>
          <p className="text-xs text-gray-400">AgroScan Vision v2.1 · 8 Disease Classes</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Upload zone */}
        {!result && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`border-2 border-dashed rounded-2xl transition-all duration-200 ${
              preview ? "border-emerald-300 bg-emerald-50" : "border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50"
            }`}
          >
            {preview ? (
              <div className="relative p-4 flex flex-col items-center">
                <img
                  src={preview}
                  alt="Crop preview"
                  className="max-h-44 rounded-xl object-cover shadow-md"
                />
                <p className="mt-3 text-sm text-gray-600 font-medium">{selectedFile?.name}</p>
                {/* Scan overlay when loading */}
                {loading && (
                  <div className="mt-3 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-xs text-amber-700 font-medium">
                        {scanSteps[scanStep]}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-200"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">{scanProgress}%</p>
                  </div>
                )}
                {!loading && (
                  <button
                    onClick={handleReset}
                    className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    ✕ Remove image
                  </button>
                )}
              </div>
            ) : (
              <label htmlFor="pest-file-upload" className="flex flex-col items-center justify-center p-8 cursor-pointer">
                <div className="text-5xl mb-3">📷</div>
                <p className="text-sm font-semibold text-gray-700">Drop a crop image here</p>
                <p className="text-xs text-gray-400 mt-1">or click to browse · PNG, JPG up to 10 MB</p>
                <input
                  id="pest-file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            )}
          </div>
        )}

        {/* Analyse button */}
        {selectedFile && !result && !loading && (
          <button
            onClick={handleAnalyze}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-amber-200"
          >
            🔬 Analyse with AgroScan AI
          </button>
        )}

        {loading && (
          <button disabled className="w-full py-3 bg-amber-400 text-white font-semibold rounded-xl opacity-70 cursor-not-allowed">
            Scanning... {scanProgress}%
          </button>
        )}

        {/* Results */}
        {result && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">
                  🔍 {result.length} Issue{result.length > 1 ? "s" : ""} Detected
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">AgroScan AI · Confidence-ranked results</p>
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                ← Scan Another
              </button>
            </div>

            <div className="space-y-4">
              {result.map((detection, index) => (
                <div
                  key={index}
                  className={`border rounded-2xl p-4 ${
                    index === 0 && detection.severity === "High"
                      ? "border-red-200 bg-red-50"
                      : index === 0
                      ? "border-amber-200 bg-amber-50"
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{detection.emoji}</span>
                        <div>
                          <h5 className="font-bold text-gray-900 text-sm">{detection.pest}</h5>
                          <p className="text-xs text-gray-500">{detection.description}</p>
                        </div>
                      </div>
                    </div>
                    <SeverityBadge level={detection.severity} />
                  </div>

                  {/* Confidence bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Detection Confidence</span>
                      <span className="font-bold text-amber-600">{detection.confidence}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                        style={{ width: `${detection.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                      📉 Crop loss: {detection.cropLoss}
                    </span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                      ⚠️ {detection.urgency}
                    </span>
                  </div>

                  {/* Symptoms */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Symptoms Observed</p>
                    <ul className="space-y-1">
                      {detection.symptoms.map((s, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                          <span className="text-amber-500 mt-0.5">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Treatment tabs */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Treatment Plan</p>
                    <div className="flex gap-2 mb-3">
                      {["organic", "chemical"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab((prev) => ({ ...prev, [index]: tab }))}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 ${
                            (activeTab[index] || "organic") === tab
                              ? tab === "organic"
                                ? "bg-emerald-500 text-white"
                                : "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {tab === "organic" ? "🌿 Organic" : "🧪 Chemical"}
                        </button>
                      ))}
                    </div>
                    <ul className="space-y-1.5">
                      {((activeTab[index] || "organic") === "organic"
                        ? detection.organicTreatment
                        : detection.chemicalTreatment
                      ).map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700 bg-white rounded-lg p-2 border border-gray-100">
                          <span className="font-bold text-gray-400 w-4 flex-shrink-0">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-400 text-center">
              Results are AI-generated. Consult your local Krishi Vigyan Kendra for confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PestDetection
