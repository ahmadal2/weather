# Getting Started with Weather Dashboard 2025

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get your API key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key

4. **Configure environment variables**
   - Copy the `.env.example` file to `.env`
   - Replace `your_api_key_here` with your actual API key
   ```env
   VITE_WEATHER_API_KEY=your_actual_api_key_here
   ```

## Development

### Start the development server
```bash
npm run dev
```
or
```bash
npm start
```

The application will be available at `http://localhost:5173`

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Project Structure

```
weather-dashboard/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # Vue components
│   ├── services/        # API services
│   ├── stores/          # Pinia stores
│   ├── views/           # Page components
│   ├── router/          # Routing configuration
│   ├── App.vue          # Root component
│   └── main.js          # Entry point
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore file
├── README.md            # Project documentation
├── DOCUMENTATION.md     # Technical documentation
├── GETTING_STARTED.md   # This file
└── package.json         # Project dependencies and scripts
```

## Features Overview

### Current Weather
- Real-time temperature, humidity, and pressure
- Weather condition icons
- "Feels like" temperature

### Forecast
- 5-day weather forecast
- Interactive charts with Chart.js
- Temperature and precipitation visualization

### Alerts
- Weather warnings and notifications
- Severity-based coloring
- Detailed alert information

### Favorites
- Save frequently accessed locations
- Quick access to favorite cities
- Persistent storage with localStorage

### Settings
- Customizable default location
- Temperature unit selection
- Dark mode toggle
- Notification preferences

## Customization

### Changing the Default Location
1. Open the Settings panel in the application
2. Update the "Default Location" field
3. The change will persist across sessions

### Temperature Units
Choose between:
- Celsius (°C)
- Fahrenheit (°F)
- Kelvin (K)

### Theme
Toggle between light and dark modes based on your preference.

## Troubleshooting

### API Key Issues
- Ensure your API key is correctly set in the `.env` file
- Verify your API key is active in your OpenWeatherMap account
- Check that you haven't exceeded the API call limit

### Development Server Issues
- Ensure you're using Node.js version 14 or higher
- Try clearing the node_modules folder and reinstalling dependencies
- Check the console for specific error messages

### Build Issues
- Verify all dependencies are installed
- Check for TypeScript or ESLint errors
- Ensure environment variables are correctly set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Support

For support, please open an issue on the GitHub repository or contact the maintainers.