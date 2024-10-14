import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Modal, Image } from 'react-native';
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
  const [groupedCreditHistory, setGroupedCreditHistory] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [modalVisible, setModalVisible] = useState(false);

  const months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];

  useEffect(() => {
    if (accessToken && userID) {
      // Fetch user data when component mounts
      fetchUserData(userID, accessToken).then((data) => {
        if (data) {
          setUserData(data);
        }
      });

      fetchCreditHistory(selectedMonth, selectedYear, accessToken).then((creditHistory) => {
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
  }, [accessToken, selectedMonth, selectedYear, userID]);

  return (
    <SafeAreaView className="h-full bg-blueDark">
      <ScrollView className="bg-whitePrimary">
        <View className="flex-col items-center">
          {/* Month Selection Button */}
          <View className="px-5 py-2.5">
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="flex-row justify-between w-full"
              style={{ paddingVertical: 10, borderBottomColor: '#d1d1d1', borderBottomWidth: 1 }}
            >
              <Text className="uppercase text-blueDark font-mulish-semi-bold">
                {months.find((month) => month.value === selectedMonth)?.label || 'Select Month'}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={16} color="#7d7cff" />
            </TouchableOpacity>
          </View>

          {/* Modal for month selection */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <View style={{ width: 300, backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20 }}>Select Month</Text>
                {months.map((month) => (
                  <TouchableOpacity
                    key={month.value}
                    onPress={() => {
                      setSelectedMonth(month.value);
                      setModalVisible(false);
                    }}
                    style={{ paddingVertical: 10 }}
                  >
                    <Text style={{ fontSize: 16 }}>{month.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>

          <Text className="text-black font-mulish-bold text-base my-4">How Does The Credit Work?</Text>
          <View className="w-full h-44 mb-6 bg-[#FFFFFF]">
            <Image source={flow} className="w-full ml-1 h-[180px]" />
          </View>
          <View className="flex-col items-center pb-1">
            <Text className="text-blueDark text-2xl font-mulish-bold">
              {userData?.credit_limit ? `$${userData.credit_limit.toFixed(2)}` : '$ 0.0'}
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
