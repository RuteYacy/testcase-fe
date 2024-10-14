import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import flow from '../../assets/images/white_flowchart.jpg';

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper function to extract time from date string
const extractTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper function to format the date into "Day, Month Day" format
const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

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

const fetchCreditHistory = async (month, year, accessToken) => {
  try {
    const response = await fetch(
      `http://localhost:8000/credit-limit/monthly?month=${month}&year=${year}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch credit history');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching credit history:', error);
    return [];
  }
};

const CreditHistory = () => {
  const { accessToken, userID } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [creditData, setCreditData] = useState(null);
  const [groupedCreditHistory, setGroupedCreditHistory] = useState({});

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    if (accessToken, userID) {
      // Fetch user data when component mounts
      fetchUserData(userID, accessToken).then((data) => {
        if (data) {
          setUserData(data);
        }
      });

      fetchCreditHistory(currentMonth, currentYear, accessToken).then((creditHistory) => {
        // Group credit history by date
        const creditHistoryByDate = creditHistory.reduce((acc, credit) => {
          const date = credit.created_at;
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(credit);
          return acc;
        }, {});

        setGroupedCreditHistory(creditHistoryByDate);
      });
    }
  }, [accessToken]);

  return (
    <SafeAreaView className="h-full bg-blueDark">
      <ScrollView className="bg-whitePrimary">
        <View className="flex-col items-center">
          <View className="border-b border-slate-300 px-5 py-2.5 mt-1.5">
            <View className="flex-row justify-between w-full">
              <Text className="uppercase text-blueDark font-mulish-semi-bold">October</Text>
              <View>
                <MaterialIcons name="keyboard-arrow-down" size={16} style={{ paddingTop: 5 }} color="#7d7cff" />
              </View>
            </View>
          </View>
          <Text className="text-black font-mulish-bold text-base my-4">How Does The Credit Work?</Text>
          <View className="w-full h-44 mb-6 bg-[#FFFFFF]">
            <Image source={flow} className="w-full ml-1 h-[180px]" />
          </View>
          <View className="flex-col items-center pb-1">
            <Text className="text-blueDark text-2xl font-mulish-bold">
              {userData?.credit_limit ? `$${userData.credit_limit.toFixed(2)}` : 'Loading...'}
            </Text>
            <Text className="text-black text-sm mb-6 font-mulish-extra-light">Current Credit</Text>
          </View>
        </View>

        <View className="px-4">
          {Object.keys(groupedCreditHistory).map((date, index) => (
            <View key={index} className="mb-4">
              {/* Display formatted date */}
              <Text className="text-slate-500 text-sm uppercase mt-1.5">{formatDate(date)}</Text>

              {groupedCreditHistory[date].map((credit, idx) => (
                <View key={idx} className="flex-row justify-between items-center border-b border-slate-300 py-3">
                  <View className="gap-y-0.5">
                  <Text className="text-black font-mulish-bold">
                    {credit?.credit_limit > 0 ? 'Increase Of Credit' : 'Decrease Of Credit'}
                  </Text>
                    <Text className="text-black font-mulish-regular">Primary Emotion: {' '}
                      {capitalizeFirstLetter(credit.primary_emotion)}
                    </Text>
                    <Text className="text-slate-400">{extractTime(credit.created_at)}</Text>
                  </View>
                  <Text
                    className={`font-mulish-semi-bold text-base ${
                      parseFloat(credit?.amount || 0) < 0 ? 'text-red-500' : 'text-blueDark'
                    }`}
                  >
                    {credit?.credit_limit !== undefined && credit?.credit_limit !== null
                      ? (typeof credit.credit_limit === 'string'
                        ? credit.credit_limit.replace(',', '.')
                        : credit.credit_limit.toFixed(2))
                      : 'N/A'}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreditHistory;
