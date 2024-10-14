import { useRouter } from 'expo-router';
import { React, useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TextInput, Text, View, Alert, StatusBar, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import CustomButton from '../../components/CustomButton';

const EmotionalData = () => {
  const router = useRouter();
  const { accessToken, userID } = useContext(AuthContext);

  const [primaryEmotion, setPrimaryEmotion] = useState('anger');
  const [intensity, setIntensity] = useState(0.0);
  const [context, setContext] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emotions = [
    'anger', 'anxiety', 'stress', 'happiness', 'calm', 'neutral', 'sadness', 'fear', 'surprise',
  ];

  const handleSelectEmotion = (emotion) => {
    setPrimaryEmotion(emotion);
  };

  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/emotional-data/save-emotional-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          primary_emotion: primaryEmotion,
          intensity: parseFloat(intensity),
          context: context,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to submit emotional data');
      }

      Alert.alert('Success', 'Emotional data saved successfully');
      setSubmitted(true);

      // Now send the data to the Kafka endpoint
      await sendToKafka(data);

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendToKafka = async (emotionalData) => {
    try {
      const kafkaResponse = await fetch('http://localhost:8000/kafka/send-emotional-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(emotionalData),
      });

      const kafkaData = await kafkaResponse.json();

      if (!kafkaResponse.ok) {
        throw new Error(kafkaData.detail || 'Failed to send emotional data to Kafka');
      }

    } catch (error) {
      console.log('Error', error.message);
    }
  };

  const handleIncrement = () => {
    setIntensity((prev) => (prev < 1 ? parseFloat((prev + 0.1).toFixed(1)) : 1));
  };

  const handleDecrement = () => {
    setIntensity((prev) => (prev > 0 ? parseFloat((prev - 0.1).toFixed(1)) : 0));
  };

  return (
    <SafeAreaView className="h-full bg-whitePrimary dark:bg-black">
      <View
        className='w-full bg-white h-12'
      />
      <TouchableOpacity
        className='p-10 absolute top-5 left-[-20px] z-10'
        onPress={() => router.push('/(tabs)/emotional-history')}
      >
        <Ionicons name="arrow-back" size={24} color="gray" />
      </TouchableOpacity>

      <ScrollView className="h-full">
        <View className="w-full justify-center items-center h-full px-4">
          <Text className="py-8 text-center text-3xl font-bold font-mulish-bold text-black dark:text-whitePrimary">
            How Are You Feeling Today?
          </Text>

          {/* Primary Emotion Input */}
          <View className="w-full">
            <Text className="text-lg text-center pb-1 font-mulish-bold mb-2 text-slate-700 dark:text-whitePrimary">
              What Is Your Primary Emotion?
            </Text>
            <View className="flex flex-row flex-wrap justify-between">
              {emotions.map((emotion) => (
                <TouchableOpacity
                  key={emotion}
                  className={`p-3 rounded-lg mb-2 flex-1 m-1 ${
                    primaryEmotion === emotion ? 'bg-blueDark' : 'bg-white'
                  }`}
                  style={{
                    minWidth: '48%',
                    borderColor: primaryEmotion === emotion ? 'blue' : '#d3d3d3',
                    borderWidth: 1,
                  }}
                  onPress={() => handleSelectEmotion(emotion)}
                >
                  <Text
                    className={`text-lg text-center ${
                      primaryEmotion === emotion ? 'text-white font-mulish-bold' : 'text-black font-mulish-light'
                    }`}
                  >
                    {capitalize(emotion)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Intensity Input */}
          <View className="w-full mt-4 items-center">
            <Text className="text-lg font-mulish-bold mb-2 text-slate-700 dark:text-whitePrimary">
              Intensity
            </Text>

            <Text className="text-2xl font-mulish-bold mb-4 text-slate-400 dark:text-whitePrimary">
              {intensity.toFixed(1)}
            </Text>

            <View className="flex flex-row justify-center w-[95%]">
              <TouchableOpacity
                className="bg-blueDark w-full flex-1 py-1"
                onPress={handleDecrement}
                disabled={intensity <= 0}
              >
                <Text className="text-white text-2xl font-mulish-bold text-center">-</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-blueDark w-full flex-1 py-1"
                onPress={handleIncrement}
                disabled={intensity >= 1}
              >
                <Text className="text-white text-2xl font-mulish-bold text-center">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Context Input */}
          <View className="w-full mt-8">
            <Text className="text-lg text-center pb-1 font-mulish-bold mb-2 text-slate-700 dark:text-whitePrimary">
              What Is The Reason To Feel Like This?
            </Text>
            <TextInput
              className="border border-gray p-3 font-mulish-light rounded-lg text-lg"
              placeholder="Context (Optional)"
              value={context}
              onChangeText={setContext}
            />
          </View>

          <CustomButton
            title={loading ? 'Submitting...' : submitted ? 'Submitted' : 'Submit'}
            containerStyles={`bg-blueDark w-full mt-12 ${submitted ? 'opacity-50' : ''}`}
            textStyles={'text-slate-100'}
            handlePress={handleSubmit}
            disabled={loading || submitted}
          />
        </View>
      </ScrollView>

      <StatusBar />
    </SafeAreaView>
  );
};

export default EmotionalData;
