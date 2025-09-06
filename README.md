# Weather Dashboard 2025

A modern, responsive weather dashboard built with Vue.js 3, Chart.js, and OpenWeatherMap API.

## Features

- **Current Weather**: Real-time weather information for any location
- **5-Day Forecast**: Detailed weather forecast with interactive charts
- **Weather Alerts**: Important weather warnings and notifications
- **Favorites**: Save and quickly access your favorite locations
- **Responsive Design**: Works on all devices from mobile to desktop
- **Dark Mode**: Eye-friendly dark theme option
- **Settings**: Customize your weather experience

## Technologies Used

- **Vue.js 3**: Progressive JavaScript framework for building user interfaces
- **Vite**: Next generation frontend tooling
- **Chart.js**: Simple yet flexible JavaScript charting library
- **Pinia**: Intuitive, type safe, light and flexible Store for Vue
- **OpenWeatherMap API**: Weather data provider
- **CSS3**: Modern styling with responsive design

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd weather-dashboard
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Get your API key from [OpenWeatherMap](https://openweathermap.org/api)

5. Create a `.env` file in the root directory and add your API key:
   ```env
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm run test
```

## Project Structure

```
src/
├── components/          # Reusable Vue components
├── services/            # API service layer
├── stores/              # Pinia stores for state management
├── views/               # Page components
├── router/              # Vue Router configuration
├── App.vue             # Root component
└── main.js             # Application entry point
```

## Components

- **CurrentWeather**: Displays current weather conditions
- **ForecastChart**: Interactive chart for weather forecast
- **WeatherAlert**: Displays weather alerts and warnings
- **FavoriteLocations**: Manage favorite locations
- **SettingsPanel**: User preferences and settings

## Store

- **Weather Store**: Manages weather data, favorites, and application state

## Services

- **Weather Service**: Handles API calls to OpenWeatherMap

## Responsive Design

The dashboard is fully responsive and works on:
- Mobile devices (320px and above)
- Tablets (768px and above)
- Desktops (1024px and above)

## Customization

You can customize:
- Default location
- Temperature units (Celsius, Fahrenheit, Kelvin)
- Weather alert notifications
- Dark mode preference

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather data API
- [Vue.js](https://vuejs.org/) for the amazing framework
- [Chart.js](https://www.chartjs.org/) for the charting library