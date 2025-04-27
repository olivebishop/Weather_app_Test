import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, CloudSun } from "lucide-react"

interface WeatherIconProps {
  icon: string
  size?: number
}

export default function WeatherIcon({ icon, size = 24 }: WeatherIconProps) {
  // Map OpenWeatherMap icon codes to Lucide icons
  switch (icon) {
    case "01d":
      return <Sun size={size} className="text-yellow-500" />
    case "01n":
      return <Sun size={size} className="text-gray-400" />
    case "02d":
    case "02n":
      return <CloudSun size={size} className="text-gray-500" />
    case "03d":
    case "03n":
    case "04d":
    case "04n":
      return <Cloud size={size} className="text-gray-500" />
    case "09d":
    case "09n":
      return <CloudDrizzle size={size} className="text-blue-400" />
    case "10d":
    case "10n":
      return <CloudRain size={size} className="text-blue-500" />
    case "11d":
    case "11n":
      return <CloudLightning size={size} className="text-yellow-600" />
    case "13d":
    case "13n":
      return <CloudSnow size={size} className="text-blue-200" />
    case "50d":
    case "50n":
      return <CloudFog size={size} className="text-gray-400" />
    default:
      return <Sun size={size} className="text-yellow-500" />
  }
}
