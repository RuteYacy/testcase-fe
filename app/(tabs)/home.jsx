import { useRouter } from 'expo-router';
import { React, useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

import { AuthContext } from '../../context/AuthContext';
import { MaterialCommunityIcons, MaterialIcons, SimpleLineIcons, Ionicons } from '@expo/vector-icons';

const fetchUserData = async (userID, accessToken) => {
  try {
    const response = await fetch(
      `http://localhost:8000/users/${userID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

const fetchEmotionalData = async (month, year, accessToken) => {
  try {
    const response = await fetch(
      `http://localhost:8000/emotional-data/monthly?month=${month}&year=${year}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch emotional data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching emotional data:", error);
    return [];
  }
};

const fetchTransactionHistory = async (month, year, accessToken) => {
  try {
    const response = await fetch(
      `http://localhost:8000/transaction-history/monthly?month=${month}&year=${year}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch transaction history");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return [];
  }
};

// Predefined map for all possible categories and their icons
const categoryMap = {
  home: <Ionicons name="home-outline" size={24} color="#4645ff" />,
  other: <MaterialCommunityIcons name="asterisk" size={24} color="#4645ff" />,
  transactions: <MaterialIcons name="currency-exchange" size={24} color="#4645ff" />,
  food: <Ionicons name="fast-food-outline" size={24} color="#4645ff" />,
  education: <SimpleLineIcons name="graduation" size={24} color="#4645ff" />,
  personal: <Ionicons name="person-outline" size={24} color="#4645ff" />,
  communication: <SimpleLineIcons name="screen-smartphone" size={24} color="#4645ff" />,
  entertainment: <MaterialCommunityIcons name="television-play" size={24} color="#4645ff" />,
  health: <Ionicons name="medkit-outline" size={24} color="#4645ff" />,
  transport: <Ionicons name="car-sport-outline" size={24} color="#4645ff" />,
  tax: <MaterialCommunityIcons name="hand-coin-outline" size={24} color="#4645ff" />,
};

// Function to calculate the bar color
const getBarColor = (value, absoluteMax) => {
  if (value < 0) return 'bg-red-800';
  const percentage = (value / absoluteMax) * 100;
  if (percentage > 60) return 'bg-blueDark';
  if (percentage > 20) return 'bg-blueLight';
  return 'bg-gray';
};

const Home = () => {
  const router = useRouter();
  const { accessToken, userID } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [emotionData, setEmotionData] = useState([]);
  const [data, setData] = useState({ categories: {} });

  const maxValue = Math.max(...Object.values(data.categories || { 0: 0 }));
  const minValue = Math.min(...Object.values(data.categories || { 0: 0 }));
  const absoluteMax = Math.max(maxValue, Math.abs(minValue));

  const emotionColorMap = {
    anger: 'bg-red-700',
    anxiety: 'bg-orange-600',
    stress: 'bg-green-700',
    happiness: 'bg-yellow-400',
    calm: 'bg-blue-300',
    neutral: 'bg-gray',
    sadness: 'bg-blue-500',
    fear: 'bg-purple-600',
    surprise: 'bg-pink-600',
    empty: 'bg-slate-200'
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    if (accessToken && userID) {
      // Fetch user data
      fetchUserData(userID, accessToken).then((data) => {
        if (data) {
          setUserData(data);
        }
      });

      // Fetch emotional data
      fetchEmotionalData(currentMonth, currentYear, accessToken).then((emotions) => {
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        const filledEmotions = Array.from({ length: daysInMonth }, (_, i) => {
          return emotions[i] || { primary_emotion: 'empty' };
        });
        setEmotionData(filledEmotions);
      });

      // Fetch transaction history
      fetchTransactionHistory(currentMonth, currentYear, accessToken).then((transactions) => {
        const categoryTotals = transactions.reduce((acc, transaction) => {
          const category = transaction.category;
          const amount = transaction.amount;
          acc[category] = (acc[category] || 0) + amount;
          return acc;
        }, {});

        setData((prevData) => ({
          ...prevData,
          categories: {
            ...prevData.categories,
            ...categoryTotals,
          },
        }));
      });
    }
  }, [accessToken]);


  return (
    <SafeAreaView className="h-full bg-blueDark">
      {/* User header */}
      <View className="bg-blueDark p-4 flex-row justify-between">
        <View className="flex-row items-center my-2 ml-0.5">
          <View className="w-10 h-10 bg-blueLight rounded-full justify-center items-center">
            <Text className="text-whitePrimary uppercase">
              {userData ? userData.name.charAt(0).toUpperCase() : '+'}
            </Text>
          </View>
          <Text className="text-whitePrimary ml-2 text-lg">
            {userData ? `Hello, ${userData.name}` : 'Loading...'}
          </Text>
        </View>
      </View>

      <ScrollView className="bg-whitePrimary h-full px-3 shadow shadow-slate-900">
        {/* Balance and Credit Limit */}
        <View className='py-5 flex flex-row justify-between gap-3'>
          <View className='bg-slate-200 px-3 py-3 flex-1 rounded-lg'>
            <Text className="text-black text-base font-mulish-regular">Balance</Text>
            <Text className="text-black text-xl">
              {userData && userData.balance !== null ? `$ ${userData.balance.toFixed(2)}` : '0.00'}
            </Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push('/transaction-history')}
            >
              <Text className="text-blueLight text-sm font-mulish-semi-bold pt-0.5">
                View transactions
              </Text>
              <MaterialIcons name="keyboard-arrow-right" size={16} style={{ paddingTop: 5 }} color="#7d7cff" />
            </TouchableOpacity>
          </View>
          <View className='bg-slate-200 px-3 py-3 flex-1 rounded-lg'>
            <Text className="text-black text-base font-mulish-regular">Credit Limit:</Text>
            <Text className="text-black text-xl">
              {userData && userData.credit_limit !== null ? `$ ${userData.credit_limit.toFixed(2)}` : '0.00'}
            </Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push('/credit-history')}
            >
              <Text className="text-blueLight text-sm font-mulish-semi-bold pt-0.5">
                View credit history
              </Text>
              <MaterialIcons name="keyboard-arrow-right" size={16} style={{ paddingTop: 5 }} color="#7d7cff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Emotions */}
        <View className='px-1'>
          <View className="">
            <View className='flex-row items-center justify-between mb-3'>
              <Text className="text-black text-lg font-mulish-semi-bold">Daily Emotions</Text>
              <TouchableOpacity onPress={() => router.push('/emotional-history')}>
                <Text className="text-blueLight text-sm font-mulish-regular">View More</Text>
              </TouchableOpacity>
            </View>
            <View className='flex-row justify-around items-end gap-2'>
              {emotionData.length > 0 ? (
                emotionData.map((emotion, index) => (
                  <View key={index} className='items-center'>
                    <View
                      className={`${emotion ? emotionColorMap[emotion.primary_emotion] : emotionColorMap['empty']} w-1.5 rounded h-12`}
                    />
                  </View>
                ))
              ) : (
                Array(31).fill(null).map((_, index) => (
                  <View key={index} className='items-center'>
                    <View className="bg-slate-200 w-1.5 rounded h-12" />
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Spendings */}
          <View className='mt-5'>
            <Text className="text-black text-lg mb-3 font-mulish-semi-bold">Spendings</Text>
            <View className='flex-row justify-around items-end'>
              {Object.keys(data.categories).length > 0 ? (
                Object.keys(data.categories).map((category, index) => (
                  <View key={index} className='items-center'>
                    <View
                      className={`${getBarColor(data.categories[category], absoluteMax)} w-4 rounded mb-3`}
                      style={{
                        height: (Math.abs(data.categories[category]) / absoluteMax) * 150,
                        marginBottom: data.categories[category] < 0 ? 0 : undefined,
                      }}
                    />
                    <Text className='pt-3'>
                      {categoryMap[category] || null}
                    </Text>
                  </View>
                ))
              ) : (
                Object.keys(categoryMap).map((category, index) => (
                  <View key={index} className='items-center'>
                    <Text className='pt-10'>
                      {categoryMap[category] || null}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Spending by Category */}
          <View className='mt-8 h-full'>
            <Text className="text-black text-lg mb-1 font-mulish-semi-bold">Spending by Category</Text>
            {Object.keys(data.categories).length > 0 ? (
              Object.keys(data.categories).map((category, index) => (
                <View key={index} className='flex-row justify-between items-center py-3 border-b border-slate-300'>
                  <View className='flex-row items-center flex-1 text-center'>
                    <Text>{categoryMap[category]}</Text>
                    <Text className="text-gray-500 text-sm ml-2.5">{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                  </View>
                  <View className='flex-1 flex flex-row items-center justify-end gap-x-1'>
                    <View className='flex-col items-end'>
                      <Text className="text-black text-base font-mulish-regular text-end">
                        R$ {data.categories[category].toFixed(2)}
                      </Text>
                      <Text className="text-slate-500 text-sm text-end">
                        {(((data.categories[category]) / 1270) * 100).toFixed(1)}%
                      </Text>
                    </View>
                    <View className='bg-whitePrimary '>
                      <MaterialIcons name="keyboard-arrow-right" size={20} color="#7d7cff" />
                    </View>
                  </View>
                </View>
              ))
            ) : (
              Object.keys(categoryMap).map((category, index) => (
                <View key={index} className='flex-row justify-between items-center py-3 border-b border-slate-300'>
                  <View className='flex-row items-center flex-1 text-center'>
                    <Text>{categoryMap[category]}</Text>
                    <Text className="text-gray-500 text-sm ml-2.5">{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
