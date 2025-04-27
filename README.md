# Weather App

A modern weather application built with Next.js and Laravel, featuring real-time weather data, forecasts, and geolocation.

![Weather App Screenshot](/placeholder.svg?height=400&width=800)

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

### Backend
- Laravel 10+
- PHP 8.1+

### APIs
- OpenWeatherMap API for weather data
- OpenWeatherMap Geocoding API for location services

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

### 2. Commit Message Convention

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

### 3. Development Workflow

When contributing to this project, make sure to:

1. Install Husky hooks after cloning the repository by running `pnpm install` (the prepare script will set up Husky automatically)
2. Follow the conventional commit format for all your commits
3. Pull the latest changes before starting new work
4. Create feature branches for new features or bug fixes