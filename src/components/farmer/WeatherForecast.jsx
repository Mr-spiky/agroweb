"use client"

import { useState, useEffect } from "react"
import { mockWeatherData } from "../../utils/mockData"

const cities = Object.keys(mockWeatherData)

const WeatherForecast = () => {
  const [selectedCity, setSelectedCity] = useState("Bangalore")
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTip, setActiveTip] = useState(0)

  useEffect(() => {
    setLoading(true)
    // Simulate brief fetch delay
    const t = setTimeout(() => {
      setWeather(mockWeatherData[selectedCity])
      setLoading(false)
      setActiveTip(0)
    }, 600)
    return () => clearTimeout(t)
  }, [selectedCity])

  // Rotate through forecast tips
  useEffect(() => {
    if (!weather) return
    const interval = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % weather.forecast.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [weather])

  const getSoilMoistureColor = (text) => {
    if (text.includes("Very Low")) return "text-red-600"
    if (text.includes("Low")) return "text-amber-600"
    if (text.includes("Moderate")) return "text-blue-600"
    if (text.includes("High")) return "text-emerald-600"
    return "text-gray-600"
  }

  const getUVLabel = (uv) => {
    if (uv <= 2) return { label: "Low", color: "text-green-600" }
    if (uv <= 5) return { label: "Moderate", color: "text-amber-500" }
    if (uv <= 7) return { label: "High", color: "text-orange-500" }
    return { label: "Very High", color: "text-red-600" }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">🌦️</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Weather Forecast</h3>
            <p className="text-xs text-gray-400">Hyper-local farming advisory</p>
          </div>
        </div>
        {/* City Selector */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
        >
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <div className="text-4xl animate-bounce">🌤️</div>
          <p className="text-sm text-gray-400">Loading weather for {selectedCity}...</p>
        </div>
      ) : weather ? (
        <>
          {/* Current Conditions */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-5 text-white mb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">{selectedCity} · {weather.region} India</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold">{weather.current.temperature}°</span>
                  <span className="text-blue-200 text-sm">Feels {weather.current.feelsLike}°C</span>
                </div>
                <p className="text-blue-100 mt-1">{weather.current.condition}</p>
              </div>
              <div className="text-6xl">{weather.current.icon}</div>
            </div>

            {/* Metrics */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[
                { label: "Humidity", value: `${weather.current.humidity}%`, icon: "💧" },
                { label: "Wind", value: `${weather.current.windSpeed} km/h`, icon: "🌬️" },
                { label: "UV Index", value: `${weather.current.uvIndex} – ${getUVLabel(weather.current.uvIndex).label}`, icon: "☀️" },
                { label: "Soil", value: weather.current.soilMoisture, icon: "🌱" },
              ].map((m) => (
                <div key={m.label} className="bg-white/10 rounded-xl p-2 text-center">
                  <div className="text-lg mb-0.5">{m.icon}</div>
                  <p className="text-xs text-blue-100">{m.label}</p>
                  <p className="text-xs font-bold text-white leading-tight">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Alerts */}
          {weather.alerts && weather.alerts.length > 0 && (
            <div className="mb-4">
              {weather.alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                  <span className="text-lg flex-shrink-0">⚠️</span>
                  <p className="text-sm text-red-700 font-medium">{alert.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* 5-Day Forecast */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">5-Day Forecast</h4>
            <div className="grid grid-cols-5 gap-2">
              {weather.forecast.map((day, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-2.5 text-center transition-all duration-200 cursor-default ${
                    index === activeTip
                      ? "bg-blue-50 border-2 border-blue-300 shadow-sm"
                      : "bg-gray-50 border border-gray-100 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTip(index)}
                >
                  <p className="text-xs font-semibold text-gray-600">{day.day}</p>
                  <div className="text-2xl my-1.5">{day.icon}</div>
                  <p className="text-xs text-gray-500 leading-tight">{day.condition}</p>
                  <div className="mt-1.5">
                    <span className="text-sm font-bold text-gray-900">{day.high}°</span>
                    <span className="text-xs text-gray-400 ml-1">{day.low}°</span>
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-0.5 text-xs text-blue-500">
                    <span>💧</span>
                    <span>{day.precipitation}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farming Tip for active day */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-xl flex-shrink-0">🌾</span>
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-1">
                  Farming Tip · {weather.forecast[activeTip]?.day}
                </p>
                <p className="text-sm text-emerald-700 font-medium">
                  {weather.forecast[activeTip]?.farmingTip}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default WeatherForecast
