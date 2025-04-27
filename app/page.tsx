"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Wind, Droplets,  Loader2, Thermometer, Eye, Gauge } from "lucide-react"
import { Toaster, toast } from 'sonner'
import { motion, AnimatePresence } from "framer-motion"
import WeatherIcon from "@/components/weather-icon"

interface DailyForecast {
  date: string
  temp: number
  icon: string
  description: string
}

interface WeatherData {
  city: string
  country: string
  date: string
  temp: number
  feels_like: number
  description: string
  icon: string
  windSpeed: number
  humidity: number
  pressure: number
  visibility: number
  forecast: DailyForecast[]
}

// ForecastCard component - inline to avoid referring to external components
interface ForecastCardProps {
  date: string
  temp: number
  icon: string
  unit: "celsius" | "fahrenheit"
}

const ForecastCard = ({ date, temp, icon, unit }: ForecastCardProps) => (
  <motion.div 
    className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <p className="text-gray-700 font-medium">{date}</p>
    <WeatherIcon icon={icon} size={50} />
    <p className="text-2xl font-bold">{temp}°{unit === "celsius" ? "C" : "F"}</p>
  </motion.div>
);

export default function Home() {
  const [city, setCity] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius")
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = async (cityName: string = city) => {
    if (!cityName) {
      toast.error("Please enter a city name")
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Validate the response data
      if (!data.city || !data.forecast || !Array.isArray(data.forecast)) {
        throw new Error("Invalid weather data received")
      }
      
      setWeatherData(data)
      setCity(data.city)
      
      // Show success toast
      toast.success(`Weather updated`, {
        description: `Latest weather for ${data.city}, ${data.country}`
      })
    } catch (error) {
      console.error("Error fetching weather data:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(`Failed to fetch weather data. ${errorMessage}`)
      
      toast.error("Weather data error", {
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch weather for default city on initial load
  useEffect(() => {
    if (!weatherData && !city) {
      // Default to Tokyo for Japanese theme
      setCity("Tokyo")
      fetchWeather("Tokyo")
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchWeather()
  }

  const convertTemp = (temp: number): number => {
    if (unit === "fahrenheit") {
      return Math.round((temp * 9) / 5 + 32)
    }
    return Math.round(temp)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-gray-900/80 via-gray-600/40 to-gray-300/30 p-4 md:p-8">
      <Toaster position="top-right" richColors />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center mb-6"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Weather Forecast</h1>
       
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="p-6">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" 
                role="alert"
              >
                <p className="font-medium">Error fetching weather data</p>
                <p className="text-sm mt-1">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Search Bar with custom Tailwind */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full py-2 pl-10 pr-4 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition-all"
                required
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={18} />
            </div>
            
            <motion.button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors shadow-md font-medium"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </>
              ) : "Search"}
            </motion.button>

            {/* Custom Temperature Unit Toggle with Tailwind */}
            <div className="flex bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <motion.button
                type="button"
                className={`px-3 py-1.5 text-sm font-medium ${
                  unit === "celsius" 
                    ? "bg-blue-600 text-white" 
                    : "bg-transparent text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setUnit("celsius")}
                whileTap={{ scale: 0.95 }}
              >
                °C
              </motion.button>
              <motion.button
                type="button"
                className={`px-3 py-1.5 text-sm font-medium ${
                  unit === "fahrenheit" 
                    ? "bg-blue-600 text-white" 
                    : "bg-transparent text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setUnit("fahrenheit")}
                whileTap={{ scale: 0.95 }}
              >
                °F
              </motion.button>
            </div>
          </form>

          <AnimatePresence>
            {weatherData && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Current Weather */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-lg flex flex-col items-center"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <WeatherIcon icon={weatherData.icon} size={80} />
                  </motion.div>
                  <div className="mt-4 text-center">
                    <motion.h1 
                      className="text-5xl font-bold text-gray-900"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {convertTemp(weatherData.temp)}°{unit === "celsius" ? "C" : "F"}
                    </motion.h1>
                    <motion.p 
                      className="text-xl capitalize mt-1 text-gray-800"
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {weatherData.description}
                    </motion.p>
                    <motion.p 
                      className="text-md text-gray-600 mt-1"
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Feels like: {convertTemp(weatherData.feels_like)}°{unit === "celsius" ? "C" : "F"}
                    </motion.p>
                    <motion.div
                      className="mt-4 pt-4 border-t border-gray-200"
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <p className="text-gray-500">{formatDate(weatherData.date)}</p>
                      <p className="font-medium text-gray-800">
                        {weatherData.city}, {weatherData.country}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Weather Forecast */}
                <div className="md:col-span-2">
                  <motion.h2 
                    className="text-xl font-semibold mb-4 text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    3-Day Forecast
                  </motion.h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-800">
                    {weatherData.forecast.slice(0, 3).map((day, index) => (
                      <ForecastCard
                        key={index}
                        date={formatDate(day.date)}
                        temp={convertTemp(day.temp)}
                        icon={day.icon}
                        unit={unit}
                      />
                    ))}
                  </div>

                  {/* Weather Details */}
                  <motion.div 
                    className="grid grid-cols-2 gap-4 mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <motion.div 
                      className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      whileHover={{ y: -5 }}
                    >
                      <h3 className="text-gray-600 font-medium mb-2 flex items-center">
                        <Wind className="mr-2" size={18} />
                        Wind Status
                      </h3>
                      <div className="flex items-center">
                        <span className="text-3xl font-bold text-gray-800">{weatherData.windSpeed}</span>
                        <span className="ml-1 text-gray-600">km/h</span>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      whileHover={{ y: -5 }}
                    >
                      <h3 className="text-gray-600 font-medium mb-2 flex items-center">
                        <Droplets className="mr-2" size={18} />
                        Humidity
                      </h3>
                      <div className="flex items-center">
                        <span className="text-3xl font-bold text-gray-800">{weatherData.humidity}</span>
                        <span className="ml-1 text-gray-600">%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                        <motion.div
                          className="bg-blue-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${weatherData.humidity}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Additional Weather Info */}
                  <motion.div 
                    className="grid grid-cols-2 gap-4 mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <motion.div 
                      className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      whileHover={{ y: -5 }}
                    >
                      <h3 className="text-gray-600 font-medium mb-2 flex items-center">
                        <Gauge className="mr-2" size={18} />
                        Pressure
                      </h3>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-800">{weatherData.pressure}</span>
                        <span className="ml-1 text-gray-600">hPa</span>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      whileHover={{ y: -5 }}
                    >
                      <h3 className="text-gray-600 font-medium mb-2 flex items-center">
                        <Eye className="mr-2" size={18} />
                        Visibility
                      </h3>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-800">{(weatherData.visibility / 1000).toFixed(1)}</span>
                        <span className="ml-1 text-gray-600">km</span>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!weatherData && !loading && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-white mb-6"
                >
                  <Thermometer className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-xl">Search for a city to get weather information</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button 
                    onClick={() => fetchWeather("Tokyo")} 
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg font-medium"
                  >
                    <Search className="inline mr-2" size={18} />
                    Get Tokyo Weather
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {loading && !weatherData && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mx-auto mb-4 w-16 h-16 text-blue-500"
                >
                  <Loader2 className="h-16 w-16" />
                </motion.div>
                <p className="text-xl text-white">Loading weather data...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.div 
          className="bg-white/5 backdrop-blur-sm p-4 text-center text-white/80 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>Weather data provided by OpenWeather API</p>
        </motion.div>
      </motion.div>
    </main>
  )
}