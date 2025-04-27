<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache; 
use Carbon\Carbon;

class WeatherController extends Controller
{
    /**
     * Getting weather data for a city
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWeather(Request $request)
    {
        $city = $request->query('city', 'London');
        
        // Cache key should be after $city is defined
        $cacheKey = "weather_{$city}";
        if (Cache::has($cacheKey)) {
            return response()->json(Cache::get($cacheKey));
        }
        
        $apiKey = env('OPENWEATHER_API_KEY');
        
        try {
            // Get current weather
            $currentWeatherResponse = Http::get("https://api.openweathermap.org/data/2.5/weather", [
                'q' => $city,
                'appid' => $apiKey,
                'units' => 'metric'
            ]);
            
            if ($currentWeatherResponse->failed()) {
                return response()->json([
                    'error' => 'Failed to fetch current weather data'
                ], 500);
            }
            
            $currentWeather = $currentWeatherResponse->json();
            
            // Get forecast data
            $forecastResponse = Http::get("https://api.openweathermap.org/data/2.5/forecast", [
                'q' => $city,
                'appid' => $apiKey,
                'units' => 'metric'
            ]);
            
            if ($forecastResponse->failed()) {
                return response()->json([
                    'error' => 'Failed to fetch forecast data'
                ], 500);
            }
            
            $forecastData = $forecastResponse->json();
            
            // Process forecast data to get daily forecasts
            $dailyForecasts = $this->processForecastData($forecastData);
            
            // Format response with additional fields
            $response = [
                '_source' => 'laravel_backend', 
                'city' => $currentWeather['name'],
                'country' => $currentWeather['sys']['country'],
                'date' => Carbon::now()->toIso8601String(),
                'temp' => $currentWeather['main']['temp'],
                'feels_like' => $currentWeather['main']['feels_like'] ?? null, 
                'icon' => $currentWeather['weather'][0]['icon'],
                'windSpeed' => $currentWeather['wind']['speed'],
                'humidity' => $currentWeather['main']['humidity'],
                'pressure' => $currentWeather['main']['pressure'] ?? null,
                'visibility' => $currentWeather['visibility'] ?? null, 
                'forecast' => $dailyForecasts
            ];
            
          //caching
            Cache::put($cacheKey, $response, now()->addMinutes(30));
            
            return response()->json($response);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Process forecast data to get daily forecasts
     *
     * @param array $forecastData
     * @return array
     */
    private function processForecastData($forecastData)
    {
        $dailyForecasts = [];
        $processedDays = [];
        
        // Get forecasts for the next 3 days (excluding today)
        foreach ($forecastData['list'] as $forecast) {
            $date = Carbon::createFromTimestamp($forecast['dt']);
            $day = $date->format('Y-m-d');
            
            // Skip today
            if ($date->isToday()) {
                continue;
            }
            
            // Only take one forecast per day (noon time preferably)
            if (!in_array($day, $processedDays) && count($processedDays) < 3) {
                $processedDays[] = $day;
                
                $dailyForecasts[] = [
                    'date' => $date->toIso8601String(),
                    'temp' => $forecast['main']['temp'],
                    'icon' => $forecast['weather'][0]['icon'],
                    'description' => $forecast['weather'][0]['description'], // Add description
                ];
            }
        }
        
        
        
        return $dailyForecasts;
    }
}