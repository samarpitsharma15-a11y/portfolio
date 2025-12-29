
export interface WeatherData {
  city: string;
  temperature: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  description: string;
  aiAdvice: string;
  sources: Array<{ title: string; web: { uri: string } }>;
}

export enum WeatherCondition {
  SUNNY = 'Sunny',
  CLOUDY = 'Cloudy',
  RAINY = 'Rainy',
  SNOWY = 'Snowy',
  STORM = 'Storm',
  UNKNOWN = 'Unknown'
}

export interface AppState {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}
