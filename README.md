# Weather App

A modern weather application built with Next.js and Laravel, featuring real-time weather data, forecasts, and geolocation.

![Weather App Screenshot](https://github.com/olivebishop/Weather_app_Test/blob/main/weather.png?raw=true)

## Features

- Current weather conditions display
- 3-day weather forecast
- Temperature unit conversion (Celsius/Fahrenheit)
- City search functionality
- Automatic location detection using browser geolocation
- Wind speed and humidity information
- Responsive design for all devices
- Fallback mechanisms for API failures

## Technologies Used

### Frontend
- Next.js 15.3.1
- TypeScript
- Tailwind CSS
- Lucide React icons
- RippleUI components
- Husky for Git hooks
- Commitlint for enforcing conventional commit messages
- Framer Motion for animations

### Backend
- Laravel 10+
- PHP 8.1+

### APIs
- OpenWeatherMap API for weather data

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- npm, yarn, or pnpm
- PHP (v8.1 or higher)
- Composer
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/olivebishop/Weather_app_Test
cd weather-app
```

### 2. Install Frontend Dependencies

Using pnpm:

```bash
pnpm install
```

To add Framer Motion to the project:

```bash
pnpm add framer-motion
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_API_URL=your_backend_api_url
```

### 4. Start the Development Server

```bash
pnpm dev
```

The application will be available at http://localhost:3000

### 5. Commit Message Convention

This project uses Husky and commitlint to enforce conventional commit messages. All commit messages must follow this format:

```
type(scope?): subject
```

Where:
- `type` can be: feat, fix, docs, style, refactor, test, chore, etc.
- `scope` is optional and indicates the section of the codebase
- `subject` is a short description of the change

Examples of valid commit messages:
- `feat: add temperature unit conversion`
- `fix(api): resolve weather data fetch errors`
- `docs: update installation instructions`
- `style: improve header responsiveness`

