import { useRouter } from 'expo-router';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import flow from '../../assets/images/white_flowchart.jpg';

import { AuthContext } from '../../context/AuthContext';

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper function to format the date into "Day, Month Day" format
const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

// Helper function to extract time from date string
const extractTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

const fetchCreditLimitByEmotion = async (emotional_data_id, accessToken) => {
  try {
    const response = await fetch(
      `http://localhost:8000/credit-limit/emotion/${emotional_data_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch credit limit");
    }
    const creditLimitData = await response.json();
    return creditLimitData.risk_score;
  } catch (error) {
    console.error(`Error fetching credit limit for emotional_data_id ${emotional_data_id}:`, error);
    return null;
  }
};


const EmotionalHistory = () => {
  const router = useRouter();
  const { accessToken } = useContext(AuthContext);

  const [groupedEmotionalData, setGroupedEmotionalData] = useState({});

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    if (accessToken) {
      fetchEmotionalData(currentMonth, currentYear, accessToken).then(async (data) => {
        // Group emotional data by date
        const emotionalDataByDate = data.reduce((acc, emotionalEntry) => {
          const date = emotionalEntry.timestamp.split('T')[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(emotionalEntry);
          return acc;
        }, {});

        const updatedData = {};
        for (const date in emotionalDataByDate) {
          updatedData[date] = await Promise.all(
            emotionalDataByDate[date].map(async (entry) => {
              const riskScore = await fetchCreditLimitByEmotion(entry.id, accessToken);
              return {
                ...entry,
                risk_score: riskScore,
              };
            })
          );
        }

        setGroupedEmotionalData(updatedData);
      });
    }
  }, [accessToken]);

  return (
    <SafeAreaView className="h-full bg-blueDark">
      <ScrollView className='bg-whitePrimary'>
        <View className='flex-col items-center'>
          <View className='border-b border-slate-300 px-5 py-2.5 mt-1.5'>
            <View className='flex-row justify-between w-full'>
              <Text className='uppercase text-blueDark font-mulish-semi-bold'>October</Text>
              <View>
                <MaterialIcons name="keyboard-arrow-down" size={16} style={{ paddingTop: 5 }} color="#7d7cff" />
              </View>
            </View>
          </View>
          <Text className='text-black font-mulish-bold text-base my-4'>What Is The Emotional Data For?</Text>
          <View className='w-full h-[168px] bg-[#FFFFFF]'>
            <Image
              source={flow}
              className='w-full ml-1 h-[180px]'
            />
          </View>
          <TouchableOpacity
            className='w-full flex items-center'
          >
            <CustomButton
              handlePress={() => router.push('/emotional-data')}
              title="Add Today's Emotional Data"
              containerStyles="w-[95%] my-7 border border-gray bg-blueDark"
              textStyles="text-whitePrimary font-semibold"
            />
          </TouchableOpacity>
        </View>

        <View className='px-4'>
          {/* Loop through grouped emotional data by date */}
          {Object.keys(groupedEmotionalData).map((date, index) => (
            <View key={index} className='mb-4'>
              {/* Display formatted date */}
              <Text className='text-slate-500 text-sm uppercase mt-1.5'>{formatDate(date)}</Text>

              {/* Display each emotional entry for that date */}
              {groupedEmotionalData[date].map((entry, idx) => (
                <View key={idx} className='flex-row justify-between items-center border-b border-slate-300 py-3'>
                  <View className='gap-y-0.5'>
                    <Text className='text-black font-mulish-bold'>{capitalizeFirstLetter(entry.primary_emotion)}</Text>
                    <Text className='text-black font-mulish-regular pb-0.5'>Intensity: {' '}{entry.intensity}</Text>
                    <Text className='text-slate-400'>{extractTime(entry.timestamp)}</Text>
                  </View>
                  <View className='text-right'>
                    <Text className='text-black font-mulish-bold'>
                      Risk Score: <Text className='text-blueDark'>{entry.risk_score ? entry.risk_score : 'N/A'}</Text>
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmotionalHistory;
