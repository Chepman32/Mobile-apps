import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import PushNotification from 'react-native-push-notification';
import Share from 'react-native-share';

const screenWidth = Dimensions.get('window').width;

const WeatherScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeather = useCallback(async (lat, lon) => {
    // This is a placeholder for fetching weather data from a local cache or a minimal API
    // In a real app, you'd have a mechanism to update this data periodically when online
    const dummyWeatherData = {
      temperature: (Math.random() * 20 + 10).toFixed(1), // 10-30 C
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      humidity: (Math.random() * 50 + 50).toFixed(0), // 50-100%
      windSpeed: (Math.random() * 10 + 5).toFixed(1), // 5-15 km/h
      forecast: [
        { day: 'Mon', temp: (Math.random() * 10 + 15).toFixed(0) },
        { day: 'Tue', temp: (Math.random() * 10 + 15).toFixed(0) },
        { day: 'Wed', temp: (Math.random() * 10 + 15).toFixed(0) },
        { day: 'Thu', temp: (Math.random() * 10 + 15).toFixed(0) },
        { day: 'Fri', temp: (Math.random() * 10 + 15).toFixed(0) },
      ],
    };
    setWeatherData(dummyWeatherData);
    await AsyncStorage.setItem('cachedWeatherData', JSON.stringify(dummyWeatherData));
  }, []);

  useEffect(() => {
    const getLocationAndWeather = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
        });
        setLocation(position.coords);
        fetchWeather(position.coords.latitude, position.coords.longitude);
      } catch (error) {
        console.error('Geolocation error:', error);
        Alert.alert('Location Error', 'Could not get current location. Displaying cached data if available.');
        const cachedData = await AsyncStorage.getItem('cachedWeatherData');
        if (cachedData) {
          setWeatherData(JSON.parse(cachedData));
        }
      }
    };
    getLocationAndWeather();

    // Schedule a daily weather update notification (conceptual)
    PushNotification.localNotificationSchedule({
      message: "Daily weather update available!", // (required)
      date: new Date(Date.now() + 60 * 1000 * 60 * 24), // 24 hours from now
      repeatType: 'day',
    });
  }, [fetchWeather]);

  const shareWeather = async () => {
    if (!weatherData) return;

    const weatherText = `Current Weather:\nTemperature: ${weatherData.temperature}°C\nCondition: ${weatherData.condition}\nHumidity: ${weatherData.humidity}%\nWind: ${weatherData.windSpeed} km/h\n\nForecast:\n${weatherData.forecast.map(f => `${f.day}: ${f.temp}°C`).join('\n')}`;

    try {
      await Share.open({
        message: weatherText,
        title: 'My Weather Update',
      });
    } catch (error) {
      console.error('Error sharing weather:', error);
      Alert.alert('Share Failed', 'Could not share weather data.');
    }
  };

  const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Current Weather</Text>
      {weatherData ? (
        <View style={styles.weatherCard}>
          <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
          <Text style={styles.condition}>{weatherData.condition}</Text>
          <Text style={styles.details}>Humidity: {weatherData.humidity}%</Text>
          <Text style={styles.details}>Wind: {weatherData.windSpeed} km/h</Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading weather data...</Text>
      )}

      {weatherData && weatherData.forecast && (
        <View>
          <Text style={styles.chartTitle}>5-Day Forecast</Text>
          <LineChart
            data={{
              labels: weatherData.forecast.map(f => f.day),
              datasets: [
                {
                  data: weatherData.forecast.map(f => parseFloat(f.temp)),
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      <TouchableOpacity style={styles.shareButton} onPress={shareWeather}>
        <Text style={styles.buttonText}>Share Weather</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.premiumButton} onPress={() => Alert.alert('Premium', 'Purchase premium for advanced forecasts and historical data.')}>
        <Text style={styles.buttonText}>Go Premium</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  weatherCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007bff',
  },
  condition: {
    fontSize: 24,
    color: '#666',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    color: '#555',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: 'gray',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  shareButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default WeatherScreen;
