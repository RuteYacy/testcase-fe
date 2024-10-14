import { useFonts } from 'expo-font';
import { React, useEffect, useState } from 'react';
import { SplashScreen, Stack } from 'expo-router';

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

  const [wsMessage, setWsMessage] = useState(null);

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

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
        setWsMessage(message);
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
