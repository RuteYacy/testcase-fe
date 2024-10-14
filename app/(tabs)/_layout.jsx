import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const TabsLayout = () => {
  return (
    <>
      <Tabs>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarShowLabel: false,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size}  />
            ),
          }}
        />
        <Tabs.Screen
          name="emotional-history"
          options={{
            title: 'Emotional History',
            tabBarShowLabel: false,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="happy-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="transaction-history"
          options={{
            title: 'Transaction History',
            tabBarShowLabel: false,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="currency-exchange" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="credit-history"
          options={{
            title: 'Credit History',
            tabBarShowLabel: false,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="card-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarShowLabel: false,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
