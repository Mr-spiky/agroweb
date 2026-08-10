"use client"

import { useState } from "react"
import { getCropRecommendations } from "../../utils/mockData"

const ConfidenceBar = ({ value }) => (
  <div className="mt-1">
    <div className="flex justify-between text-xs text-gray-500 mb-1">
      <span>AI Confidence</span>
      <span className="font-semibold text-emerald-600">{value}%</span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
)

const ProfitBadge = ({ level }) => {
  const styles = {
    "Very High": "bg-emerald-100 text-emerald-800 border-emerald-200",
    High: "bg-green-100 text-green-800 border-green-200",
    Medium: "bg-amber-100 text-amber-800 border-amber-200",
    Low: "bg-gray-100 text-gray-600 border-gray-200",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[level] || styles.Medium}`}>
      💰 {level} Profit
    </span>
  )
}

const WaterBadge = ({ level }) => {
  const styles = {
    High: "bg-blue-100 text-blue-700",
    Medium: "bg-cyan-100 text-cyan-700",
    Low: "bg-yellow-100 text-yellow-700",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[level] || styles.Medium}`}>
      💧 {level} Water
    </span>
  )
}

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    soilType: "",
    region: "",
    season: "",
    waterAvailability: "",
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [analysisStep, setAnalysisStep] = useState(0)

  const analysisSteps = [
    "Analysing soil composition...",
    "Checking regional climate patterns...",
    "Evaluating market demand data...",
    "Computing profit projections...",
    "Generating recommendations...",
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setAnalysisStep(0)

    // Animated analysis steps
    let step = 0
    const stepInterval = setInterval(() => {
      step++
      setAnalysisStep(step)
      if (step >= analysisSteps.length) clearInterval(stepInterval)
    }, 400)

    setTimeout(() => {
      const recommendations = getCropRecommendations(
        formData.soilType,
        formData.season,
        formData.region,
        formData.waterAvailability
      )
      setResult(recommendations)
      setLoading(false)
    }, 2200)
  }

  const handleReset = () => {
    setResult(null)
    setFormData({ soilType: "", region: "", season: "", waterAvailability: "" })
    setAnalysisStep(0)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">🤖</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Crop Advisor</h3>
          <p className="text-xs text-gray-400">AgroScan Intelligence v2.1 · India Crop Database</p>
        </div>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="soilType" className="form-label">🪨 Soil Type</label>
              <select id="soilType" name="soilType" value={formData.soilType} onChange={handleChange} className="form-input" required>
                <option value="">Select soil type</option>
                <option value="clay">Clay (Heavy, water-retaining)</option>
                <option value="loam">Loam (Fertile, balanced)</option>
                <option value="sandy">Sandy (Light, draining)</option>
                <option value="silt">Silt (Fine, fertile)</option>
              </select>
            </div>

            <div>
              <label htmlFor="region" className="form-label">🗺️ Region</label>
              <select id="region" name="region" value={formData.region} onChange={handleChange} className="form-input" required>
                <option value="">Select region</option>
                <option value="north">North India (Punjab, UP, Haryana)</option>
                <option value="south">South India (TN, Karnataka, AP)</option>
                <option value="east">East India (WB, Bihar, Assam)</option>
                <option value="west">West India (Mah, Gujarat, Raj)</option>
                <option value="central">Central India (MP, CG)</option>
              </select>
            </div>

            <div>
              <label htmlFor="season" className="form-label">🌤️ Season</label>
              <select id="season" name="season" value={formData.season} onChange={handleChange} className="form-input" required>
                <option value="">Select season</option>
                <option value="spring">Spring / Rabi sowing (Feb–Mar)</option>
                <option value="summer">Summer / Zaid (Apr–Jun)</option>
                <option value="monsoon">Monsoon / Kharif (Jul–Sep)</option>
                <option value="winter">Winter / Rabi harvest (Oct–Jan)</option>
              </select>
            </div>

            <div>
              <label htmlFor="waterAvailability" className="form-label">💧 Water Availability</label>
              <select id="waterAvailability" name="waterAvailability" value={formData.waterAvailability} onChange={handleChange} className="form-input" required>
                <option value="">Select water availability</option>
                <option value="high">High (Canal / Bore well)</option>
                <option value="medium">Medium (Rain-fed + supplemental)</option>
                <option value="low">Low (Rain-fed only)</option>
              </select>
            </div>
          </div>

          {/* Loading animation */}
          {loading && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-emerald-700 text-sm font-medium ml-1">
                  {analysisSteps[Math.min(analysisStep, analysisSteps.length - 1)]}
                </span>
              </div>
              <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-400"
                  style={{ width: `${((analysisStep + 1) / analysisSteps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-emerald-200"
          >
            {loading ? "Analysing..." : "🤖 Get AI Recommendations"}
          </button>
        </form>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">
              ✅ {result.length} Crop{result.length > 1 ? "s" : ""} Recommended
            </h4>
            <button onClick={handleReset} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              ← Analyse Again
            </button>
          </div>

          {/* Input summary */}
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { label: formData.soilType, icon: "🪨" },
              { label: formData.region, icon: "🗺️" },
              { label: formData.season, icon: "🌤️" },
              { label: formData.waterAvailability + " water", icon: "💧" },
            ].map((tag) => (
              <span key={tag.label} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">
                {tag.icon} {tag.label}
              </span>
            ))}
          </div>

          <div className="space-y-4">
            {result.map((rec, index) => (
              <div
                key={index}
                className={`border rounded-2xl p-4 transition-all hover:shadow-sm ${
                  index === 0
                    ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                {index === 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full mb-2">
                    ⭐ Best Match
                  </span>
                )}

                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-bold text-gray-900 text-base">
                      {rec.emoji} {rec.crop}
                    </h5>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <ProfitBadge level={rec.profit} />
                      <WaterBadge level={rec.waterNeed} />
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        📅 {rec.growingDays} days
                      </span>
                      {rec.msp && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          MSP: ₹{rec.msp.toLocaleString("en-IN")}/qtl
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                    rec.marketDemand === "Very High" ? "bg-emerald-500 text-white" :
                    rec.marketDemand === "High" ? "bg-green-500 text-white" :
                    "bg-amber-400 text-white"
                  }`}>
                    {rec.marketDemand} demand
                  </span>
                </div>

                <ConfidenceBar value={rec.confidence} />

                {/* Tips */}
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Farming Tips</p>
                  <ul className="space-y-1.5">
                    {rec.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-400 text-center">
            Powered by AgroScan AI · Recommendations based on 10+ years of crop data
          </p>
        </div>
      )}
    </div>
  )
}

export default CropRecommendation
