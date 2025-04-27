"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Search, Wind, Droplets, Loader2, Thermometer, Eye, Gauge } from "lucide-react"
import { Toaster, toast } from 'sonner'
import { motion, AnimatePresence } from "framer-motion"
import WeatherIcon from "@/components/weather-icon"

// Define types
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
  _cached?: boolean
  _cachedAt?: string
}

type TemperatureUnit = "celsius" | "fahrenheit"

// Constants
const DEFAULT_CITY = "Tokyo"
const ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { y: -5 },
}

// ForecastCard component
interface ForecastCardProps {
  date: string
  temp: number
  icon: string
  unit: TemperatureUnit
}

const ForecastCard = ({ date, temp, icon, unit }: ForecastCardProps) => (
  <motion.div 
    className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
    whileHover={ANIMATION_VARIANTS.hover}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <p className="text-gray-700 font-medium">{date}</p>
    <WeatherIcon icon={icon} size={50} />
    <p className="text-2xl font-bold">{temp}°{unit === "celsius" ? "C" : "F"}</p>
  </motion.div>
);

// Weather Info Card Component
interface WeatherInfoCardProps {
  icon: React.ReactNode
  title: string
  value: number | string
  unit: string
  progressBar?: number
}

const WeatherInfoCard = ({ icon, title, value, unit, progressBar }: WeatherInfoCardProps) => (
  <motion.div 
    className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    whileHover={ANIMATION_VARIANTS.hover}
  >
    <h3 className="text-gray-600 font-medium mb-2 flex items-center">
      {icon}
      {title}
    </h3>
    <div className="flex items-center">
      <span className="text-2xl font-bold text-gray-800">{value}</span>
      <span className="ml-1 text-gray-600">{unit}</span>
    </div>
    
    {progressBar !== undefined && (
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
        <motion.div
          className="bg-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressBar}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    )}
  </motion.div>
);

// Weather Animation Components
const RainAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {Array.from({ length: 40 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-0.5 h-6 bg-blue-300/60 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: -20,
        }}
        animate={{
          y: ['0vh', '100vh'],
        }}
        transition={{
          duration: 0.8 + Math.random() * 0.5,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

const SnowAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {Array.from({ length: 30 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1.5 h-1.5 bg-white rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: -20,
          opacity: 0.7 + Math.random() * 0.3,
        }}
        animate={{
          y: ['0vh', '100vh'],
          x: [
            `${Math.random() * 10 - 5}px`,
            `${Math.random() * 30 - 15}px`,
            `${Math.random() * 10 - 5}px`
          ],
        }}
        transition={{
          duration: 3 + Math.random() * 5,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

const CloudsAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-white/30 rounded-full blur-xl"
        style={{
          width: 100 + Math.random() * 200,
          height: 40 + Math.random() * 40,
          top: `${10 + Math.random() * 40}%`,
          left: -300,
          opacity: 0.4 + Math.random() * 0.3,
        }}
        animate={{
          x: ['-10vw', '110vw'],
        }}
        transition={{
          duration: 40 + Math.random() * 40,
          repeat: Infinity,
          delay: Math.random() * 10,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

const ThunderstormAnimation = () => {
  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 100 + Math.random() * 150);
    }, 3000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <RainAnimation />
      <div 
        className={`absolute inset-0 bg-yellow-100/20 pointer-events-none z-0 transition-opacity duration-100 ${
          flashActive ? 'opacity-100' : 'opacity-0'
        }`} 
      />
    </>
  );
};

const MistAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-white/40 rounded-full blur-3xl"
        style={{
          width: 150 + Math.random() * 300,
          height: 40 + Math.random() * 100,
          top: `${Math.random() * 100}%`,
          left: -400,
          opacity: 0.3 + Math.random() * 0.2,
        }}
        animate={{
          x: ['-30vw', '130vw'],
        }}
        transition={{
          duration: 80 + Math.random() * 40,
          repeat: Infinity,
          delay: Math.random() * 20,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

const ClearAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {Array.from({ length: 10 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-yellow-200/20 rounded-full blur-2xl"
        style={{
          width: 20 + Math.random() * 40,
          height: 20 + Math.random() * 40,
          top: `${Math.random() * 70}%`,
          left: `${Math.random() * 100}%`,
          opacity: 0.3 + Math.random() * 0.3,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Weather Animation Controller
const WeatherAnimation = ({ icon }: { icon: string }) => {
  // Weather code patterns from OpenWeatherMap icons
  const iconPrefix = icon.slice(0, 2);
  
  switch (iconPrefix) {
    case "01": // clear sky
      return <ClearAnimation />;
    case "02": // few clouds
    case "03": // scattered clouds
    case "04": // broken clouds
      return <CloudsAnimation />;
    case "09": // shower rain
    case "10": // rain
      return <RainAnimation />;
    case "11": // thunderstorm
      return <ThunderstormAnimation />;
    case "13": // snow
      return <SnowAnimation />;
    case "50": // mist
      return <MistAnimation />;
    default:
      return null;
  }
};

// Main component
export default function WeatherApp() {
  const [city, setCity] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [unit, setUnit] = useState<TemperatureUnit>("celsius")
  const [error, setError] = useState<string | null>(null)

  // Convert temperature based on selected unit
  const convertTemp = useCallback((temp: number): number => {
    return unit === "fahrenheit" ? Math.round((temp * 9) / 5 + 32) : Math.round(temp);
  }, [unit]);

  // Format date for display
  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, []);

  // Fetch weather data from API
  const fetchWeather = useCallback(async (cityName: string = city, skipCache: boolean = false) => {
    if (!cityName) {
      toast.error("Please enter a city name");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const url = `/api/weather?city=${encodeURIComponent(cityName)}${skipCache ? '&skipCache=true' : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate the response data
      if (!data.city || !data.forecast || !Array.isArray(data.forecast)) {
        throw new Error("Invalid weather data received");
      }
      
      setWeatherData(data);
      setCity(data.city);
      
      // Show success toast with cache info if present
      if (data._cached) {
        toast.success(`Weather loaded from cache`, {
          description: `Weather for ${data.city}, ${data.country} (cached at ${new Date(data._cachedAt).toLocaleTimeString()})`,
          action: {
            label: 'Refresh',
            onClick: () => fetchWeather(data.city, true)
          }
        });
      } else {
        toast.success(`Weather updated`, {
          description: `Latest weather for ${data.city}, ${data.country}`
        });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(`Failed to fetch weather data. ${errorMessage}`);
      
      toast.error("Weather data error", {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [city]);

  // Load default city on initial render
  useEffect(() => {
    if (!weatherData && !city) {
      setCity(DEFAULT_CITY);
      fetchWeather(DEFAULT_CITY);
    }
  }, [fetchWeather, weatherData, city]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather();
  };

  // Render current weather section
  const renderCurrentWeather = () => {
    if (!weatherData) return null;
    
    return (
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
            {weatherData._cached && (
              <p className="text-xs text-blue-600 mt-1">
                Cached at {new Date(weatherData._cachedAt ?? "").toLocaleTimeString()}
                <button 
                  onClick={() => fetchWeather(weatherData.city, true)}
                  className="ml-2 underline text-blue-700 hover:text-blue-800"
                >
                  Refresh
                </button>
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // Render forecast and details section
  const renderForecastAndDetails = () => {
    if (!weatherData) return null;
    
    return (
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
          initial={ANIMATION_VARIANTS.hidden}
          animate={ANIMATION_VARIANTS.visible}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <WeatherInfoCard 
            icon={<Wind className="mr-2" size={18} />}
            title="Wind Status"
            value={weatherData.windSpeed}
            unit="km/h"
          />
          
          <WeatherInfoCard 
            icon={<Droplets className="mr-2" size={18} />}
            title="Humidity"
            value={weatherData.humidity}
            unit="%"
            progressBar={weatherData.humidity}
          />
        </motion.div>

        {/* Additional Weather Info */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mt-4"
          initial={ANIMATION_VARIANTS.hidden}
          animate={ANIMATION_VARIANTS.visible}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <WeatherInfoCard 
            icon={<Gauge className="mr-2" size={18} />}
            title="Pressure"
            value={weatherData.pressure}
            unit="hPa"
          />
          
          <WeatherInfoCard 
            icon={<Eye className="mr-2" size={18} />}
            title="Visibility"
            value={(weatherData.visibility / 1000).toFixed(1)}
            unit="km"
          />
        </motion.div>
      </div>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    if (weatherData || loading) return null;
    
    return (
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
            onClick={() => fetchWeather(DEFAULT_CITY)} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg font-medium"
          >
            <Search className="inline mr-2" size={18} />
            Get {DEFAULT_CITY} Weather
          </button>
        </motion.div>
      </motion.div>
    );
  };

  // Render loading state
  const renderLoadingState = () => {
    if (!loading || weatherData) return null;
    
    return (
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
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-gray-900/80 via-gray-600/40 to-gray-300/30 p-4 md:p-8 overflow-hidden">
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
        className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/20 relative"
      >
        {/* Weather background animation based on current condition */}
        {weatherData && <WeatherAnimation icon={weatherData.icon} />}
        
        <div className="p-6 relative z-10">
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
          
          {/* Search Bar */}
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

            {/* Temperature Unit Toggle */}
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
                {renderCurrentWeather()}
                {renderForecastAndDetails()}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {renderEmptyState()}
            {renderLoadingState()}
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