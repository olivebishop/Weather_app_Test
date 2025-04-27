import WeatherIcon from "./weather-icon"

interface ForecastCardProps {
  date: string
  temp: number
  icon: string
  unit: "celsius" | "fahrenheit"
}

export default function ForecastCard({ date, temp, icon, unit }: ForecastCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl border flex flex-col items-center">
      <p className="text-sm text-gray-500 mb-2">{date}</p>
      <WeatherIcon icon={icon} size={40} />
      <p className="mt-2 font-bold">
        {temp}°{unit === "celsius" ? "C" : "F"}
      </p>
    </div>
  )
}
