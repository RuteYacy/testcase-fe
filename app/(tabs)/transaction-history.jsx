import { React, useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';

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

const TransactionHistory = () => {
  const { accessToken, userID } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [groupedTransactions, setGroupedTransactions] = useState({});
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

      fetchTransactionHistory(selectedMonth, selectedYear, accessToken).then((transactions) => {
        // Group transactions by date
        const transactionsByDate = transactions.reduce((acc, transaction) => {
          const date = transaction.created_at;
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(transaction);
          return acc;
        }, {});

        setGroupedTransactions(transactionsByDate);
      });
    }
  }, [accessToken, selectedMonth, selectedYear, userID]);

  return (
    <SafeAreaView className="h-full bg-blueDark">
      <ScrollView className='bg-whitePrimary'>
        <View className='flex-col items-center'>
          {/* Month Selection Button */}
          <View className='px-5 py-2.5'>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className='flex-row justify-between w-full'
              style={{ paddingVertical: 10, borderBottomColor: '#d1d1d1', borderBottomWidth: 1 }}
            >
              <Text className='uppercase text-blueDark font-mulish-semi-bold'>
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

          {/* Current Balance */}
          <View className='flex-col items-center pt-6 pb-1'>
            <Text className='text-blueDark text-2xl font-mulish-bold'>
              {userData?.balance ? `$${userData.balance}` : '$ 0.0'}
            </Text>
            <Text className='text-black text-sm mb-6 font-mulish-extra-light'>Current Balance</Text>
          </View>
        </View>

        <View className='px-4'>
          {Object.keys(groupedTransactions).map((date, index) => (
            <View key={index} className='mb-4'>
              {/* Display formatted date in English */}
              <Text className='text-slate-500 text-sm uppercase mt-1.5'>{formatDate(date)}</Text>

              {groupedTransactions[date].map((transaction, idx) => (
                <View key={idx} className='flex-row justify-between items-center border-b border-slate-300 py-3'>
                  <View className='gap-y-0.5'>
                    <Text className='text-black font-mulish-bold'>{capitalizeFirstLetter(transaction.category)}</Text>
                    <Text className='text-black font-mulish-regular pb-0.5'>{capitalizeFirstLetter(transaction.type)}</Text>
                    <Text className='text-slate-400'>{extractTime(transaction.created_at)}</Text>
                  </View>
                  <Text
                    className={`font-mulish-semi-bold text-base ${
                      parseFloat(transaction.amount) < 0 ? 'text-red-500' : 'text-blueDark'
                    }`}
                  >
                    {typeof transaction.amount === 'string'
                      ? transaction.amount.replace(',', '.')
                      : transaction.amount.toFixed(2)}
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

export default TransactionHistory;
