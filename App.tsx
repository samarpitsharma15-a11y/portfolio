
import React, { useState, useEffect, useCallback } from 'react';
import { fetchWeatherWithAI } from './services/geminiService';
import { WeatherData, AppState } from './types';
import WeatherCard from './components/WeatherCard';
import { SearchIcon } from './components/Icons';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<AppState>({
    weather: null,
    loading: false,
    error: null,
  });

  const getBackgroundClass = () => {
    if (!state.weather) return 'weather-gradient-default';
    const condition = state.weather.condition.toLowerCase();
    if (condition.includes('sun') || condition.includes('clear')) return 'weather-gradient-sunny';
    if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('storm')) return 'weather-gradient-rainy';
    if (condition.includes('cloud') || condition.includes('overcast')) return 'weather-gradient-cloudy';
    return 'weather-gradient-default';
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchWeather(query);
  };

  const fetchWeather = async (location: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchWeatherWithAI(location);
      setState({ weather: data, loading: false, error: null });
    } catch (err: any) {
      setState({ weather: null, loading: false, error: err.message });
    }
  };

  const useLocalLocation = () => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: "Geolocation is not supported by your browser." }));
      return;
    }

    setState(prev => ({ ...prev, loading: true }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`${latitude}, ${longitude}`);
      },
      () => {
        setState(prev => ({ ...prev, loading: false, error: "Unable to retrieve your location. Try searching for a city instead." }));
      }
    );
  };

  useEffect(() => {
    useLocalLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-1000 ease-in-out ${getBackgroundClass()} flex flex-col items-center px-4 py-12`}>
      <div className="w-full max-w-2xl mb-12 text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tight drop-shadow-lg">SkyCast AI</h1>
        <p className="text-lg font-medium text-white/80">Smart Weather Powered by Gemini 3</p>
        
        <form onSubmit={handleSearch} className="relative mt-8 group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, country, or zip code..."
            className="w-full py-5 px-14 rounded-full bg-white/20 border border-white/30 backdrop-blur-xl text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-xl text-lg"
          />
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60">
            <SearchIcon />
          </div>
          <button
            type="submit"
            disabled={state.loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            Search
          </button>
        </form>
      </div>

      {state.loading && (
        <div className="flex flex-col items-center justify-center space-y-4 mt-20">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-white font-medium animate-pulse">Consulting Gemini for latest data...</p>
        </div>
      )}

      {state.error && (
        <div className="glass bg-red-500/20 border-red-500/50 p-6 rounded-2xl max-w-md w-full text-center mt-10">
          <p className="text-white font-semibold">{state.error}</p>
          <button 
            onClick={() => setState(prev => ({ ...prev, error: null }))}
            className="mt-4 text-sm underline hover:text-white/80"
          >
            Dismiss
          </button>
        </div>
      )}

      {!state.loading && state.weather && <WeatherCard data={state.weather} />}

      {!state.loading && !state.weather && !state.error && (
        <div className="mt-20 text-center opacity-60">
          <p>Search for a location to see the magic happen.</p>
        </div>
      )}

      <footer className="mt-auto pt-12 text-white/40 text-sm">
        Built with Google GenAI & Tailwind CSS
      </footer>
    </div>
  );
};

export default App;
