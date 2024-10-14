import { useRouter } from 'expo-router';
import { React, useState, useEffect, useContext } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';

import { AuthContext } from '../../context/AuthContext';

import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton'

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

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  const { userID, accessToken, setAccessToken } = useContext(AuthContext);

  useEffect(() => {
      if (accessToken && userID) {
          fetchUserData(userID, accessToken).then((data) => {
              if (data) {
                  setUserData(data);
              }
          });
      }
  }, [accessToken]);

  const signOut = async () => {
      try {
          const response = await fetch(
              `http://localhost:8000/users/signout`,
              {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${accessToken}`,
                  },
              }
          );

          if (!response.ok) {
              throw new Error("Failed to sign out");
          }

          setAccessToken(null);
          router.push('/')
      } catch (error) {
          console.error("Error signing out:", error);
          Alert.alert("Error", "Failed to sign out. Please try again.");
      }
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Yes",
          onPress: () => signOut(),
        },
        {
          text: "No",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };


  return (
      <SafeAreaView className="h-full bg-blueDark">
          <View className='h-full bg-white'>
              <ScrollView className="px-4 py-6">
                  {/* User Information */}
                  <View className="items-start mb-5">
                      <View className="flex-row items-center ml-0.5">
                          <Ionicons name="person-circle-outline" size={55} color="#d3d3d3" />
                          <View className="ml-3">
                              <Text className="text-xl text-gray-400 font-mulish-semi-bold">
                                  {userData ? `${userData.name}` : 'Loading...'}
                              </Text>
                              <Text className="text-slate-600 pt-0.5">
                                  {userData ? `${userData.email}` : 'Loading...'}
                              </Text>
                          </View>
                      </View>
                  </View>

                  {/* Settings Section */}
                  <View className="border-t border-gray pt-4">
                      <Text className="text-xl text-slate-700 font-mulish-bold mb-1">Settings</Text>

                      {/* General Section */}
                      <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray">
                          <View className="flex-row items-center">
                              <Ionicons name="settings-outline" size={24} color="gray" />
                              <View className="ml-4">
                                  <Text className="text-lg font-mulish-semi-bold text-gray-400">General</Text>
                                  <Text className="text-slate-600">Configure notifications, app access...</Text>
                              </View>
                          </View>
                          <Ionicons name="chevron-forward-outline" size={24} color="#d3d3d3" />
                      </TouchableOpacity>

                      {/* Registration Section */}
                      <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray">
                          <View className="flex-row items-center">
                              <Ionicons name="person-outline" size={24} color="gray" />
                              <View className="ml-4">
                                  <Text className="text-lg font-mulish-semi-bold text-gray-400">Registration</Text>
                                  <Text className="text-slate-600">Edit personal data...</Text>
                              </View>
                          </View>
                          <Ionicons name="chevron-forward-outline" size={24} color="#d3d3d3" />
                      </TouchableOpacity>

                      {/* Privacy Section */}
                      <TouchableOpacity className="flex-row items-center justify-between py-4">
                          <View className="flex-row items-center">
                              <Ionicons name="lock-closed-outline" size={24} color="gray" />
                              <View className="ml-4">
                                  <Text className="text-lg font-mulish-semi-bold text-gray-400">Privacy</Text>
                                  <Text className="text-slate-600">Personalize privacy settings...</Text>
                              </View>
                          </View>
                          <Ionicons name="chevron-forward-outline" size={24} color="#d3d3d3" />
                      </TouchableOpacity>
                  </View>

                  {/* Sign Out Button */}
                  <CustomButton
                      title="Sign Out"
                      containerStyles={'bg-blueDark w-full mt-8'}
                      textStyles={'text-slate-100'}
                      handlePress={handleSignOut}
                  />
              </ScrollView>
          </View>
      </SafeAreaView>
  );
};

export default Profile;