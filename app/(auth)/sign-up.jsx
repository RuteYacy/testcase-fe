import React, { useState, useContext } from 'react';
import { Link, router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StatusBar, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';

import { AuthContext } from '../../context/AuthContext';
import CustomButton from '../../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setAccessToken, setRefreshToken, setUserID } = useContext(AuthContext);

  const handleSignUp = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Sign-up failed');
      }

      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setUserID(data.user.id);

      router.replace("/home");
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-whitePrimary dark:bg-black">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className='w-full justify-center items-center h-full px-4'>
          <Text className="text-3xl font-bold mt-2 font-mulish-bold text-black dark:text-whitePrimary">Sign Up</Text>

          {/* Name Input Field */}
          <View className="w-full mt-8">
            <TextInput
              className="border border-gray dark:border-slate-500 p-3 font-mulish-light rounded-lg text-lg"
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email Input Field */}
          <View className="w-full mt-4">
            <TextInput
              className="border border-gray dark:border-slate-500 p-3 font-mulish-light rounded-lg text-lg"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input Field */}
          <View className="w-full mt-4 relative">
            <TextInput
              className="border border-gray dark:border-slate-500 p-3 font-mulish-light rounded-lg text-lg"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-[17px]'
            >
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#7d7cff" />
            </TouchableOpacity>
          </View>

          <CustomButton
            title={loading ? 'Signing Up...' : 'Sign Up'}
            containerStyles={'bg-blueDark w-full mt-12'}
            textStyles={'text-slate-100'}
            handlePress={handleSignUp}
            disabled={loading}
          />

          <View className="w-full mt-6">
            <Text className="text-center text-lg text-gray dark:text-slate-500 font-mulish-regular">
              Already have an account? {' '}
              <Link
                href="/sign-in"
                className="text-blueLight">
                Sign In
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>

      <StatusBar />
    </SafeAreaView>
  );
};

export default SignUp;
