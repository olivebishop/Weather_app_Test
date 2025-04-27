import { NextResponse } from "next/server"

interface ForecastItem {
  dt: number;
  main: { temp: number };
  weather: { 
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
}

interface WeatherResponse {
  name: string;
  sys: { country: string };
  main: { 
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: { speed: number };
  visibility: number;
  dt: number;
}

interface ForecastResponse {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
  };
}

interface CacheItem {
  data: any;
  timestamp: number;
}

// Cache management
const cache: Record<string, CacheItem> = {};
const CACHE_DURATION = 30 * 60 * 1000; 

function getCachedData(key: string): any | null {
  const item = cache[key];
  if (!item) return null;
  
  const now = Date.now();
  if (now - item.timestamp > CACHE_DURATION) {
    // Cache expired
    delete cache[key];
    return null;
  }
  
  console.log(`✅ Cache hit for: ${key}`);
  return item.data;
}

function setCachedData(key: string, data: any): void {
  cache[key] = {
    data,
    timestamp: Date.now()
  };
  console.log(`📦 Cached data for: ${key}`);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city") || "London"
  console.log("Weather API route called for city:", city)
  
  // Check if we should bypass cache
  const skipCache = searchParams.get("skipCache") === "true";
  
  // Generate cache key based on city
  const cacheKey = `weather:${city.toLowerCase()}`;
  
  // Try to get data from cache first (unless skipCache is true)
  if (!skipCache) {
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json({
        ...cachedData,
        _cached: true,
        _cachedAt: new Date(cache[cacheKey].timestamp).toISOString()
      });
    }
  }

  try {
    // First try to proxy the request to the Laravel backend if available
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    console.log("Attempting to use Laravel backend at:", apiUrl)
    
    let responseData;
    
    if (apiUrl) {
      try {
        console.log(`Sending request to Laravel: ${apiUrl}/api/weather?city=${encodeURIComponent(city)}`)
        const startTime = Date.now()
        
        // Adding timeout to the fetch using AbortController
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 1000) // 1 second timeout
        
        const response = await fetch(`${apiUrl}/api/weather?city=${encodeURIComponent(city)}`, {
          headers: {
            "Cache-Control": "no-cache",
          },
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        const endTime = Date.now()
        
        if (response.ok) {
          console.log(`✅ Successfully fetched from Laravel backend in ${endTime - startTime}ms`)
          responseData = await response.json()
          responseData._source = "laravel"; // Add a source identifier
          console.log("Data source: Laravel backend")
        } else {
          console.log(`❌ Laravel backend returned error: ${response.status}`)
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error("❌ Laravel request timed out after 1 second")
        } else {
          console.error("❌ Error proxying to Laravel backend:", error)
        }
        // Fall through to the fallback
      }
    }

    // If we don't have response data yet, use the OpenWeather API directly
    if (!responseData) {
      console.log("⚠️ Falling back to direct OpenWeatherMap API")
      const apiKey = process.env.OPENWEATHER_API_KEY

      if (!apiKey) {
        throw new Error("OpenWeather API key is not configured")
      }

      // Get current weather using the environment variable
      const weatherUrl = `${process.env.NEXT_PUBLIC_OPENWEATHER_API_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
      const weatherResponse = await fetch(weatherUrl, { cache: "no-store" })

      if (!weatherResponse.ok) {
        throw new Error(`OpenWeather API error: ${weatherResponse.status} ${await weatherResponse.text()}`)
      }

      const weatherData: WeatherResponse = await weatherResponse.json()

      // Get forecast data
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
        { cache: "no-store" }
      )

      if (!forecastResponse.ok) {
        throw new Error(`OpenWeather forecast API error: ${forecastResponse.status}`)
      }

      const forecastData: ForecastResponse = await forecastResponse.json()

      // Format the response to match our expected structure
      responseData = {
        city: weatherData.name,
        country: weatherData.sys.country,
        date: new Date(weatherData.dt * 1000).toISOString(),
        temp: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        windSpeed: weatherData.wind.speed,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        visibility: weatherData.visibility,
        forecast: forecastData.list
          .filter((_: ForecastItem, index: number) => index % 8 === 0) // Get one forecast per day
          .slice(0, 3) // Only take 3 days
          .map((day: ForecastItem) => ({
            date: new Date(day.dt * 1000).toISOString(),
            temp: day.main.temp,
            icon: day.weather[0].icon,
            description: day.weather[0].description,
          })),
        _source: "openweathermap"
      };
    }

    // Cache the data before returning
    setCachedData(cacheKey, responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in weather API route:", error)

    // Return an error response
    return NextResponse.json(
      {
        error: "Failed to fetch weather data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}