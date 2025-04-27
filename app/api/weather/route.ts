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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city") || "London"

  try {
    // First try to proxy the request to the Laravel backend if available
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/api/weather?city=${encodeURIComponent(city)}`, {
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        if (response.ok) {
          const data = await response.json()
          return NextResponse.json(data)
        }
      } catch (error) {
        console.error("Error proxying to Laravel backend:", error)
        // Fall through to the fallback
      }
    }

    // If the Laravel backend is unavailable, use the OpenWeather API directly
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
    const response = {
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
    }

    return NextResponse.json(response)
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