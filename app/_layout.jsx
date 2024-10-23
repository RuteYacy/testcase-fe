import { useFonts } from 'expo-font';
import { React, useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';

import AuthProvider from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

const RooyLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Mulish-Black": require("../assets/fonts/Mulish-Black.ttf"),
    "Mulish-Bold": require("../assets/fonts/Mulish-Bold.ttf"),
    "Mulish-ExtraBold": require("../assets/fonts/Mulish-ExtraBold.ttf"),
    "Mulish-ExtraLight": require("../assets/fonts/Mulish-ExtraLight.ttf"),
    "Mulish-Light": require("../assets/fonts/Mulish-Light.ttf"),
    "Mulish-Medium": require("../assets/fonts/Mulish-Medium.ttf"),
    "Mulish-Regular": require("../assets/fonts/Mulish-Regular.ttf"),
    "Mulish-SemiBold": require("../assets/fonts/Mulish-SemiBold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Request notification permissions and configure notification settings
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to send notifications is required!');
      }
    };

    requestPermissions();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }, []);

  const showNotification = async (message) => {
    const riskScore = message.risk_score;
    const creditLimit = message.credit_limit;

    const formattedMessage = `Your emotional risk is: ${riskScore}. Your new credit is: ${creditLimit}.`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Credit Limit",
        body: formattedMessage,
      },
      trigger: null,
    });
  };

  useEffect(() => {
    let ws;

    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8000/ws');
      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received WebSocket message:', message);

        // Show a notification for each WebSocket message
        showNotification(message);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed. Reconnecting...');
        setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }


  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name='index'
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='emotional-data' options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

export default RooyLayout;
