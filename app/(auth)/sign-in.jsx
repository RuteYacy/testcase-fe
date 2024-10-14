import { Link, router } from "expo-router";
import React, { useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StatusBar, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

import { AuthContext } from '../../context/AuthContext';
import CustomButton from '../../components/CustomButton';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAccessToken, setRefreshToken, setUserID } = useContext(AuthContext);

  const handleSignIn = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Sign-in failed');
      }

      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setUserID(data.user.id)

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
                <Text className="text-3xl font-bold mt-2 font-mulish-bold text-black dark:text-whitePrimary">Sign In</Text>

                <View className="w-full mt-8">
                    <TextInput
                        className="border border-gray dark:border-slate-500 p-3 font-mulish-light rounded-lg text-lg"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View className="w-full mt-4">
                    <TextInput
                        className="border border-gray dark:border-slate-500 p-3 font-mulish-light rounded-lg text-lg"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                </View>

                <TouchableOpacity>
                    <Text className="text-gray-400 mt-4 self-end text-slate-400 dark:text-slate-500 font-mulish-regular">Forgot your password?</Text>
                </TouchableOpacity>

                <CustomButton
                  title={loading ? 'Signing In...' : 'Sign In'}
                  containerStyles={'bg-blueDark w-full mt-12'}
                  textStyles={'text-slate-100'}
                  handlePress={handleSignIn}
                  disabled={loading}
                />

                <View className="w-full mt-6">
                    <Text className="text-center text-lg text-gray dark:text-slate-500 font-mulish-regular">
                        Don’t have an account yet? {' '}
                        <Link
                          href="/sign-up"
                          className="text-blueLight">
                          Sign Up
                        </Link>
                    </Text>
                </View>
            </View>
        </ScrollView>

        <StatusBar />
    </SafeAreaView>
  );
};

export default SignIn;
